import devek from 'devek';
import MD5 from './md5';
import createStore from "../../helpers/createStore";
import { parseCertificate } from './asn1';
import { prettyCert } from './cert';
import { cipherEncrypt, cipherDecrypt } from './cipher';
import { generate } from './generate';

const crypto = devek.crypto;

const actionCreators = {
  //hash
  hashInput: e => (state, actions) => {
    const input = e.target.innerText;
    const newState = { ...state, hash: { ...state.hash, input } };
    actions.hash(newState.hash);
    return newState;
  },
  hashAlg: e => (state, actions) => {
    const alg = e.target.dataset.value;
    const newState = { ...state, hash: { ...state.hash, alg } };
    actions.hash(newState.hash);
    return newState;
  },
  hash: ({ input, alg }) => async state => {
    const buf = devek.stringToUint8Array(input);
    const hash = alg === 'MD5' ? devek.arrayToHexString(MD5(input)) : new Uint8Array(await crypto.subtle.digest(alg, buf));
    return { ...state, hash: { ...state.hash, input, alg, hash } };
  },
  hashFormat: e => state => ({ ...state, hash: { ...state.hash, format: e.target.dataset.value } }),

  // cipher
  cipherAlg: e => state => ({ ...state, cipher: { ...state.cipher, alg: e.target.dataset.value }}),
  cipherKDF: e => state => ({ ...state, cipher: { ...state.cipher, kdf: e.target.dataset.value }}),
  cipherInput: e => state => ({ ...state, cipher: { ...state.cipher, input: e.target.innerText }}),
  passphrase: e => state => ({ ...state, cipher: { ...state.cipher, passphrase: e.target.value }}),
  useSalt: e => state => ({ ...state, cipher: { ...state.cipher, useSalt: e.target.checked }}),
  salt: e => state => ({ ...state, cipher: { ...state.cipher, salt: e.target.value }}),
  cipherIV: e => state => ({ ...state, cipher: { ...state.cipher, iv: e.target.value }}),
  cipherKey: e => state => ({ ...state, cipher: { ...state.cipher, cipherKey: e.target.value }}),
  cipherAESCounter: e => state => ({ ...state, cipher: { ...state.cipher, aesCounter: e.target.value }}),
  cipherJWK: e => state => ({ ...state, cipher: { ...state.cipher, jwk: e.target.innerText }}),
  encrypt: () => async state => ({
    ...state,
    cipher: {
      ...state.cipher,
      output: await cipherEncrypt(
        state.cipher.alg,
        state.cipher.input,
        state.cipher.passphrase,
        state.cipher.useSalt ? (state.cipher.salt ? devek.hexStringToArray(state.cipher.salt) : state.cipher.salt) : null,
        state.cipher.jwk
      )
    }
  }),
  decrypt: () => async state => ({
    ...state,
    cipher: {
      ...state.cipher,
      output: await cipherDecrypt(
        state.cipher.alg,
        state.cipher.input,
        state.cipher.passphrase,
        state.cipher.salt ? devek.hexStringToArray(state.cipher.salt) : state.cipher.salt,
        state.cipher.jwk
      )
    }
  }),

  //generate
  genAlgType: e => state => ({ ...state, generate: { ...state.generate, algType: e.target.dataset.value }}),
  genAsymAlg: e => state => ({ ...state, generate: { ...state.generate, asymAlg: e.target.dataset.value }}),
  genSymmAlg: e => state => ({ ...state, generate: { ...state.generate, symmAlg: e.target.dataset.value }}),
  genHashAlg: e => state => ({ ...state, generate: { ...state.generate, hashAlg: e.target.dataset.value }}),
  genFormat: e => state => ({ ...state, generate: { ...state.generate, format: e.target.dataset.value }}),
  rsaModulusLength: e => state => ({ ...state, generate: { ...state.generate, rsaModulusLength: parseInt(e.target.dataset.value) }}),
  ecNamedCurve: e => state => ({ ...state, generate: { ...state.generate, ecNamedCurve: e.target.dataset.value }}),
  aesKeyLength: e => state => ({ ...state, generate: { ...state.generate, aesKeyLength: parseInt(e.target.dataset.value) }}),
  genKey: () => generate,

  // cert
  loaded: (pem) => state => {
    const cert = parseCertificate(pem);
    if (cert.error) {
      return {...state, cert: { ...state.cert, loaded: false, pem: 'Error reading certificate\n\nMessage: ' + cert.error , output: '' }};
    }
    else {
      console.log(cert); // eslint-disable-line
      const output = prettyCert(cert);

      return {...state, cert: { ...state.cert, loaded: true, pem, output} };
    }
  },
  onDragEnter: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, cert: { ...state.cert, dragging: state.dragging + 1 } };
  },
  onDragLeave: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, cert: { ...state.cert, dragging: state.dragging - 1} } ;
  },
};

const initialState = {
  // hash
  hash: {
    input: '',
    alg: 'SHA-256',
    hash: devek.base64ToUint8Array('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='),
    format: 'Base64',
  },

  // cipher
  cipher: {
    alg: 'AES-CBC',
    kdf: 'OpenSSL',
    input: '',
    passphrase: '',
    useSalt: true,
    salt: '',
    cipherKey: '',
    iv: '',
    jwk: '',
    aesCounter: '',
    output: null,
  },

  //generate keys
  generate: {
    algType: 'Symmetric', // Symmetric / Asymmetric
    asymAlg: 'RSA-OAEP', // RSASSA-PKCS1-v1_5 / RSA-PSS / RSA-OAEP / ECDH / ECDSA
    symmAlg: 'AES-CBC', // HMAC / AES-CTR / AES-CBC / AES-GCM / AES-KW
    hashAlg: 'SHA-256', // SHA-1 / SHA-256 / SHA-384 / SHA-512
    rsaModulusLength: 2048, // 2048 / 4096
    ecNamedCurve: 'P-384', // P-256 / P-384 / P-521
    aesKeyLength: 256, // 128 / 192 / 256
    publicKey: '',
    privateKey: '',
    privateSSH: '',
    symmKey: '',
    format: 'X.509 (PKCS8+SPKI)', // JWK / SSH / X.509 (PKCS8+SPKI)
    error: '',
  },

  // cert
  cert: {
    dragging: false,
    loaded: false,
    pem: '',
    output: '',
  },
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'crypto');