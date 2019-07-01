import devek from "../../devek";
import {jwkToSSH} from "./jwkToSSH";

const _BEGIN = '-----BEGIN ', _END = '-----END ', _PRV = 'PRIVATE KEY-----', _PUB = 'PUBLIC KEY-----';
const BEGIN_RSA_PRIVATE = _BEGIN + 'RSA ' + _PRV, END_RSA_PRIVATE = _END + 'RSA ' + _PRV,
  BEGIN_EC_PRIVATE = _BEGIN + 'EC ' + _PRV, END_EC_PRIVATE = _END + 'EC ' + _PRV,
  BEGIN_PUBLIC = _BEGIN + _PUB, END_PUBLIC = _END + _PUB;

const toPrivateKey = async key => {
  const rsa = key.algorithm.name[0] === 'R';
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", key);
  const pkcs8AsBase64 = window.btoa(String.fromCharCode(...new Uint8Array(pkcs8)));
  return [ rsa ? BEGIN_RSA_PRIVATE : BEGIN_EC_PRIVATE,
    pkcs8AsBase64.match(/.{1,64}/g).join('\n'),
    rsa ? END_RSA_PRIVATE : END_EC_PRIVATE ].join('\n');
};

const toPublicKey = async key => {
  const spki = await crypto.subtle.exportKey("spki", key);
  const spkiAsBase64 = window.btoa(String.fromCharCode(...new Uint8Array(spki)));
  return [ BEGIN_PUBLIC, spkiAsBase64.match(/.{1,64}/g).join('\n'), END_PUBLIC ].join('\n');
};

const toRawKey = async key => {
  const rawBuffer = await crypto.subtle.exportKey("raw", key);
  return devek.arrayToHexString(new Uint8Array(rawBuffer));
};
const toPublicSSH = async key => {
  const jwk = await window.crypto.subtle.exportKey("jwk", key);
  return jwkToSSH(jwk);
};

const getFamily = alg => alg.match(/^(RSA|EC|AES|HMAC)/)[0];

export const generate = async state => {
  try {
    const {algType, asymAlg, symmAlg, hashAlg, rsaModulusLength, ecNamedCurve, aesKeyLength } = state.generate;
    const symmetric = algType[0] === 'S';
    const family = getFamily(symmetric ? symmAlg : asymAlg);
    let key;
    switch (family) {
      case 'RSA':
        key = await crypto.subtle.generateKey({
          name: asymAlg,
          modulusLength: rsaModulusLength,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: hashAlg
        }, true,  asymAlg === "RSA-OAEP" ? ["encrypt", "decrypt"] : ["sign", "verify"]);
        break;
      case 'EC':
        key = await crypto.subtle.generateKey({
          name: asymAlg,
          namedCurve: ecNamedCurve
        }, true, asymAlg === "ECDH" ? ["deriveKey"] : ["sign", "verify"]);
        break;
      case 'HMAC':
        key = await crypto.subtle.generateKey({
          name: symmAlg,
          hash: {name: hashAlg}
        }, true, ["sign", "verify"]);
        break;
      case 'AES':
        key = await crypto.subtle.generateKey({
          name: symmAlg,
          length: aesKeyLength
        }, true, symmAlg === 'AES-KW' ? ["wrapKey", "unwrapKey"] : ["encrypt", "decrypt"]);
        break;
      default:
        return { ...state, generate: { ...state.generate, error: 'Unknown generation algorithm' }};
    }
    if (symmetric) {
      const symmKey = await toRawKey(key);
      return {...state, generate: { ...state.generate, symmKey, error: '' }};
    }
    else {
      const publicKey = await toPublicKey(key.extractable ? key : key.publicKey);
      const privateKey = await toPrivateKey(key.extractable ? key : key.privateKey);
      const publicSSH = family === "RSA" ? await toPublicSSH(key.extractable ? key : key.publicKey) : '';
      return {...state, generate: { ...state.generate, publicKey, privateKey, publicSSH, error: '' }};
    }
  }
  catch (e) {
    return { ...state, generate: { ...state.generate, error: e.message }};
  }
};