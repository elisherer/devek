import MD5 from './md5';
import createStore from "../../helpers/createStore";
import jwkToSSH from "./jwkToSSH";

const cryptoAPI = window.crypto || window.msCrypto;

const _DEL = '-'.repeat(5), _BE = 'BEGIN', _EN = 'END', _PRV = 'PRIVATE KEY', _PUB = 'PUBLIC KEY';
const BEGIN_RSA_PRIVATE = _DEL + _BE + ' RSA ' + _PRV + _DEL, END_RSA_PRIVATE = _DEL + _EN + ' RSA ' + _PRV + _DEL,
  BEGIN_EC_PRIVATE = _DEL + _BE + ' EC ' + _PRV + _DEL, END_EC_PRIVATE = _DEL + _EN + ' EC ' + _PRV + _DEL,
  BEGIN_PUBLIC = _DEL + _BE + ' ' + _PUB + _DEL, END_PUBLIC = _DEL + _EN + ' ' + _PUB + _DEL;

const toPrivateKey = async key => {
  const rsa = key.algorithm.name[0] === 'R';
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = window.btoa(exportedAsString);
  return [ rsa ? BEGIN_RSA_PRIVATE : BEGIN_EC_PRIVATE,
    exportedAsBase64.match(/.{1,64}/g).join('\n'),
    rsa ? END_RSA_PRIVATE : END_EC_PRIVATE ].join('\n');
};

const toPublicKey = async key => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = window.btoa(exportedAsString);
  return [ BEGIN_PUBLIC, exportedAsBase64.match(/.{1,64}/g).join('\n'), END_PUBLIC ].join('\n');
};

const toPrivateSSH = async key => {
  const exported = await window.crypto.subtle.exportKey("jwk", key);
  return jwkToSSH(exported);
};

const getFamily = alg => alg.match(/^(RSA|EC)/)[0];


const actionCreators = {
  input: e => (state, actions) => {
    const input = e.target.innerText;
    const newState = { ...state, input };
    actions.hash(newState);
    return newState;
  },
  hashAlg: e => (state, actions) => {
    const hashAlg = e.target.dataset.alg;
    const newState = { ...state, hashAlg };
    actions.hash(newState);
    return newState;
  },
  hash: ({ input, hashAlg }) => async state => {
    const buf = new TextEncoder('utf-8').encode(input);
    const hash = hashAlg === 'MD5' ? MD5(input): await cryptoAPI.subtle.digest(hashAlg, buf);
    return { ...state, input, hashAlg, hash };
  },
  format: e => state => ({
    ...state,
    outputFormat: e.target.dataset.format
  }),
  genAlg: e => state => ({ ...state, genAlg: e.target.dataset.alg }),
  rsaModulusLength: e => state => ({ ...state, rsaModulusLength: parseInt(e.target.dataset.value) }),
  ecNamedCurve: e => state => ({ ...state, ecNamedCurve: e.target.dataset.value }),
  genKey: () => async state => {
    try {
      const {genAlg, genHashAlg, rsaModulusLength, ecNamedCurve } = state;
      const family = getFamily(genAlg);
      let key;
      switch (family) {
        case 'RSA':
          key = await cryptoAPI.subtle.generateKey({
            name: genAlg,
            modulusLength: rsaModulusLength,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: genHashAlg
          }, true,  genAlg === "RSA-OAEP" ? ["encrypt", "decrypt"] : ["sign", "verify"]);
          break;
        case 'EC':
          key = await cryptoAPI.subtle.generateKey({
            name: genAlg,
            namedCurve: ecNamedCurve
          }, true, genAlg === "ECDH" ? ["deriveKey"] : ["sign", "verify"]);
          break;
        default:
          throw new Error('Unknown generation algorithm');
      }

      const publicKey = await toPublicKey(key.extractable ? key : key.publicKey);
      const privateKey = await toPrivateKey(key.extractable ? key : key.privateKey);
      const privateSSH = family === "RSA" ? await toPrivateSSH(key.extractable ? key : key.privateKey) : '';
      return {...state, publicKey, privateKey, privateSSH, genError: '' };
    }
    catch (e) {
      return { ...state, genError: e.message };
    }
  },
};

const initialState = {
  // hash
  input: '',
  hashAlg: 'SHA-256',
  error: '',
  hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  outputFormat: 'hex',

  //generate keys
  genAlg: 'RSA-OAEP', // RSASSA-PKCS1-v1_5 / RSA-PSS / RSA-OAEP / ECDH / ECDSA
  genHashAlg: 'SHA-256',
  rsaModulusLength: 2048, // 2048 / 4096
  ecNamedCurve: 'P-384', // P-256 / P-384 / P-521
  publicKey: '',
  privateKey: '',
  publicSSH: '',
  genError: '',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'crypto');