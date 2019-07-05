import devek from "../../devek";
import {publicKeyJWKToSSH, privateKeyJWKToSSHNew} from "./ssh";
const crypto = devek.crypto;

const toPrivateKey = async key => {
  const rsa = key.algorithm.name[0] === 'R';
  return devek.arrayToPEM(new Uint8Array(await crypto.subtle.exportKey("pkcs8", key)), rsa ? 'RSA PRIVATE KEY' : 'EC PRIVATE KEY');
};

const toPublicKey = async key => {
  return devek.arrayToPEM(new Uint8Array(await crypto.subtle.exportKey("spki", key)), 'PUBLIC KEY');
};

const toRawKey = async key => {
  return devek.arrayToHexString(new Uint8Array(await crypto.subtle.exportKey("raw", key)));
};

const getFamily = alg => alg.match(/^(RSA|EC|AES|HMAC)/)[0];

export const generate = async state => {
  try {
    let {algType, asymAlg, symmAlg, hashAlg, rsaModulusLength, ecNamedCurve, aesKeyLength, format } = state.generate;
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
      let publicKey, privateKey, privateSSH = '';
      if (format === 'SSH' && (asymAlg !== 'RSASSA-PKCS1-v1_5' && asymAlg !== 'ECDSA')) {
        format = 'X.509 (PKCS8+SPKI)'; // switch to default
      }
      switch (format) {
        case 'JWK':
          publicKey = JSON.stringify(await crypto.subtle.exportKey("jwk", key.publicKey), null,2);
          privateKey = JSON.stringify(await crypto.subtle.exportKey("jwk", key.privateKey), null,2);
          break;
        case 'SSH': {
          const pubssh = publicKeyJWKToSSH(await crypto.subtle.exportKey("jwk", key.publicKey));
          const shaFingerprint = new Uint8Array(await crypto.subtle.digest('SHA-256', pubssh.decoded));
          publicKey = pubssh.type + ' ' + pubssh.encoded + ' ' + pubssh.comment + '\n\nFingerprints:\n' +
            'SHA256:' + devek.arrayToBase64(shaFingerprint) + '\n' + devek.arrayToHexString(devek.md5(pubssh.decoded), ':');
          privateKey = await toPrivateKey(key.extractable ? key : key.privateKey, format);
          privateSSH = privateKeyJWKToSSHNew(pubssh, await crypto.subtle.exportKey("jwk", key.privateKey));
        }
        break;
        case 'X.509 (PKCS8+SPKI)':
          publicKey = await toPublicKey(key.extractable ? key : key.publicKey, format);
          privateKey = await toPrivateKey(key.extractable ? key : key.privateKey, format);
          break;
      }

      return {...state, generate: { ...state.generate, format, publicKey, privateKey, privateSSH, error: '' }};
    }
  }
  catch (e) {
    return { ...state, generate: { ...state.generate, error: e.message }};
  }
};