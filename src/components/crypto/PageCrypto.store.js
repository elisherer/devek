import devek from 'devek';
import MD5 from './md5';
import createStore from 'helpers/createStore';
import { parseCertificate } from './asn1';
import { prettyCert } from './cert';
import {cipherEncrypt, cipherDecrypt, cipherFormat} from './cipher';
import {formatOutput, generate} from './generate';

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
  cipherPosition: e => state => ({ ...state, cipher: { ...state.cipher, position: e.target.dataset.value }}),
  cipherInput: e => state => ({ ...state, cipher: { ...state.cipher, input: e.target.innerText }}),
  passphrase: e => state => ({ ...state, cipher: { ...state.cipher, passphrase: e.target.value }}),
  useSalt: e => state => ({ ...state, cipher: { ...state.cipher, useSalt: e.target.checked }}),
  salt: e => state => ({ ...state, cipher: { ...state.cipher, salt: e.target.value }}),
  cipherIV: e => state => ({ ...state, cipher: { ...state.cipher, iv: e.target.value }}),
  cipherKey: e => state => ({ ...state, cipher: { ...state.cipher, cipherKey: e.target.value }}),
  cipherAESCounter: e => state => ({ ...state, cipher: { ...state.cipher, aesCounter: e.target.value }}),
  cipherJWK: e => state => ({ ...state, cipher: { ...state.cipher, jwk: e.target.innerText }}),
  cipherFormat: e => state => {
    const format = e.target.dataset.value;
    return {
      ...state,
      cipher: {
        ...state.cipher,
        output: {
          ...state.cipher.output,
          format,
          formatted: cipherFormat(state.cipher.output.output, format),
        }
      }
    };
  },
  encrypt: () => async state => {
    const output = await cipherEncrypt(
      state.cipher.alg,
      state.cipher.input,
      state.cipher.kdf !== 'None',
      state.cipher.position,
      state.cipher.cipherKey,
      state.cipher.iv,
      state.cipher.passphrase,
      state.cipher.useSalt,
      !state.cipher.salt,
      devek.hexStringToArray(state.cipher.salt),
      state.cipher.jwk
    );
    output.format = 'Base64';
    output.formatted = cipherFormat(output.output, output.format);

    return {
      ...state,
      cipher: {
        ...state.cipher,
        output,
      }
    };
  },
  decrypt: () => async state => {
    const output = await cipherDecrypt(
      state.cipher.alg,
      state.cipher.input,
      state.cipher.kdf !== 'None',
      state.cipher.position,
      state.cipher.cipherKey,
      state.cipher.iv,
      state.cipher.passphrase,
      state.cipher.useSalt,
      !state.cipher.salt,
      devek.hexStringToArray(state.cipher.salt),
      state.cipher.jwk
    );
    output.format = 'UTF-8';
    output.formatted = cipherFormat(output.output, output.format);
    return {
      ...state,
      cipher: {
        ...state.cipher,
        output,
      }
    };
  },

  //generate
  genAlgType: e => state => ({ ...state, generate: { ...state.generate, algType: e.target.dataset.value }}),
  genAsymAlg: e => state => ({ ...state, generate: { ...state.generate, asymAlg: e.target.dataset.value }}),
  genSymmAlg: e => state => ({ ...state, generate: { ...state.generate, symmAlg: e.target.dataset.value }}),
  genHashAlg: e => state => ({ ...state, generate: { ...state.generate, hashAlg: e.target.dataset.value }}),
  genFormat: e => async state => {
    return { ...state, generate: { ...state.generate, ...(await formatOutput(state.generate.outputKey, e.target.dataset.value)) } };
  },
  genSource: e => state => ({ ...state, generate: { ...state.generate, source: e.target.dataset.value }}),
  genKdfPassphrase: e => state => ({ ...state, generate: { ...state.generate, kdf: { ...state.generate.kdf, passphrase: e.target.value } }}),
  genKdfSalt: e => state => ({ ...state, generate: { ...state.generate, kdf: { ...state.generate.kdf, salt: e.target.value } }}),
  genKdfIterations: e => state => ({ ...state, generate: { ...state.generate, kdf: { ...state.generate.kdf, iterations: parseInt(e.target.value) } }}),
  genKdfHashAlg: e => state => ({ ...state, generate: { ...state.generate, kdf: { ...state.generate.kdf, hash: e.target.dataset.value } }}),
  rsaModulusLength: e => state => ({ ...state, generate: { ...state.generate, rsaModulusLength: parseInt(e.target.dataset.value) }}),
  ecNamedCurve: e => state => ({ ...state, generate: { ...state.generate, ecNamedCurve: e.target.dataset.value }}),
  aesKeyLength: e => state => ({ ...state, generate: { ...state.generate, aesKeyLength: parseInt(e.target.dataset.value) }}),
  genKey: () => generate,

  // cert
  loaded: (pem) => async state => {
    const cert = parseCertificate(pem);
    if (cert.error) {
      return {...state, cert: { ...state.cert, loaded: false, pem: 'Error reading certificate\n\nMessage: ' + cert.error , output: '' }};
    }
    else {
      const output = await prettyCert(cert);

      const sha1Print = devek.arrayToHexString(new Uint8Array(await crypto.subtle.digest('SHA-1', cert.buffer)));
      const md5Print = devek.arrayToHexString(MD5(cert.buffer));

      return {...state, cert: { ...state.cert, loaded: true, pem, output, sha1Print, md5Print} };
    }
  },
  onDragEnter: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, cert: { ...state.cert, dragging: state.cert.dragging + 1 } };
  },
  onDragLeave: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, cert: { ...state.cert, dragging: state.cert.dragging - 1} } ;
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
    position: 'Start',
    input: '',
    passphrase: '',
    useSalt: true,
    salt: '',
    cipherKey: '',
    iv: '',
    jwk: '',
    aesCounter: '',
    format: '',
    output: null,
    error: '',
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
    format: 'JWK', // JWK / SSH / X.509 (PKCS8+SPKI)
    source: 'Random', // Random / PBKDF2
    kdf: {
      passphrase: '',
      salt: '',
      hash: 'SHA-256',
      iterations: 10000,
    },
    error: '',
    outputKey: null,
  },

  // cert
  cert: {
    dragging: 0,
    loaded: false,
    pem: '',
    output: '',
  },
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'crypto');