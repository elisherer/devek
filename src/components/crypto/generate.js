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

const getFamily = alg => alg.match(/^(RSA|EC|AES|HMAC)/)[0];

export const SSH_SUPPORT = {
  "RSASSA-PKCS1-v1_5": 1,
  "ECDSA": 1
};
const PBKDF2_SALT_MIN_SIZE = 16;
const getPBKDF2Salt = salt => {
  salt = salt === ''
    ? crypto.getRandomValues(new Uint8Array(PBKDF2_SALT_MIN_SIZE))
    : new Uint8Array(devek.hexStringToArray(salt));
  if (salt.length < PBKDF2_SALT_MIN_SIZE) { // not enough salt
    const paddedSalt = new Uint8Array(Array.from({length: PBKDF2_SALT_MIN_SIZE}, () => 0));
    paddedSalt.set(salt, 0);
    salt = paddedSalt;
  }
  return salt;
};

export const generate = async state => {
  try {
    const {algType, asymAlg, symmAlg, source, format } = state.generate;
    const symmetric = algType[0] === 'S';
    const family = getFamily(symmetric ? symmAlg : asymAlg);
    let outputKey, kdfOutput = '';
    switch (family) {
      case 'RSA': {
        const {rsaModulusLength, hashAlg} = state.generate;
        outputKey = await crypto.subtle.generateKey({
          name: asymAlg,
          modulusLength: rsaModulusLength,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: hashAlg
        }, true, asymAlg === "RSA-OAEP" ? ["encrypt", "decrypt"] : ["sign", "verify"]);
      }
      break;
      case 'EC': {
        const {ecNamedCurve} = state.generate;
        outputKey = await crypto.subtle.generateKey({
          name: asymAlg,
          namedCurve: ecNamedCurve
        }, true, asymAlg === "ECDH" ? ["deriveKey"] : ["sign", "verify"]);
      }
      break;
      case 'HMAC': {
        const { hashAlg, kdf } = state.generate;
        const hmacKeyGenParams = {
          name: symmAlg,
          hash: {name: hashAlg}
        };
        if (source === 'Random') {
          outputKey = await crypto.subtle.generateKey(hmacKeyGenParams, true, ["sign", "verify"]);
        } else { // PBKDF2
          const keyMaterial = await crypto.subtle.importKey(
            "raw", devek.stringToUint8Array(kdf.passphrase),
            { name: "PBKDF2" },
            false, ["deriveBits", "deriveKey"]
          );
          const salt = getPBKDF2Salt(kdf.salt);
          kdfOutput = `salt = ${devek.arrayToHexString(salt)}`;
          outputKey = await crypto.subtle.deriveKey({
              name: "PBKDF2",
              salt,
              iterations: kdf.iterations,
              hash: kdf.hash
            },
            keyMaterial, hmacKeyGenParams, true, ["sign", "verify"]
          )
        }
      }
      break;
      case 'AES': {
        const { aesKeyLength, kdf } = state.generate;
        const aesKeyGenParams = {
          name: symmAlg,
          length: aesKeyLength
        }, aesKeyUsages = symmAlg === 'AES-KW' ? ["wrapKey", "unwrapKey"] : ["encrypt", "decrypt"];
        if (source === 'Random') {
          outputKey = await crypto.subtle.generateKey(aesKeyGenParams, true, aesKeyUsages);
        } else { // PBKDF2
          const keyMaterial = await crypto.subtle.importKey(
            "raw", devek.stringToUint8Array(kdf.passphrase),
            { name: "PBKDF2" },
            false, ["deriveBits", "deriveKey"]
          );
          const salt = getPBKDF2Salt(kdf.salt);
          kdfOutput = `salt = ${devek.arrayToHexString(salt)}`;
          outputKey = await crypto.subtle.deriveKey({
              name: "PBKDF2",
              salt,
              iterations: kdf.iterations,
              hash: kdf.hash
            },
            keyMaterial, aesKeyGenParams, true, aesKeyUsages
          )
        }
      }
      break;
      default:
        return { ...state, generate: { ...state.generate, outputKey: null, error: 'Unknown generation algorithm' }};
    }
    return { ...state, generate: { ...state.generate, outputKey, kdf: {...state.generate.kdf, output: kdfOutput }, ...(await formatOutput(outputKey, format)) } };
  }
  catch (e) {
    return { ...state, generate: { ...state.generate, outputKey: null, error: e.name + ': ' + e.message }};
  }
};

export const formatOutput = async (outputKey, format) => {
  const symmetric = outputKey.extractable;
  try {
    if (symmetric) {
      const symmKey = devek.arrayToHexString(new Uint8Array(await crypto.subtle.exportKey("raw", outputKey)));
      return { symmKey, error: ''};
    } else {
      let publicKey, privateKey, privateSSH = '';
      if (format === 'SSH' && !SSH_SUPPORT[outputKey.publicKey.algorithm.name]) {
        format = 'JWK'; // switch to default
      }
      switch (format) {
        case 'JWK':
          publicKey = JSON.stringify(await crypto.subtle.exportKey("jwk", outputKey.publicKey), null, 2);
          privateKey = JSON.stringify(await crypto.subtle.exportKey("jwk", outputKey.privateKey), null, 2);
          break;
        case 'SSH': {
          const pubssh = publicKeyJWKToSSH(await crypto.subtle.exportKey("jwk", outputKey.publicKey));
          const shaFingerprint = new Uint8Array(await crypto.subtle.digest('SHA-256', pubssh.decoded));
          publicKey = pubssh.type + ' ' + pubssh.encoded + ' ' + pubssh.comment + '\n\nFingerprints:\n' +
            'SHA256:' + devek.arrayToBase64(shaFingerprint) + '\n' + devek.arrayToHexString(devek.md5(pubssh.decoded), ':');
          privateKey = await toPrivateKey(outputKey.privateKey, format);
          privateSSH = privateKeyJWKToSSHNew(pubssh, await crypto.subtle.exportKey("jwk", outputKey.privateKey));
        }
          break;
        case 'X.509 (PKCS8+SPKI)':
          publicKey = await toPublicKey(outputKey.publicKey, format);
          privateKey = await toPrivateKey(outputKey.privateKey, format);
          break;
      }

      return { format, publicKey, privateKey, privateSSH, error: ''};
    }
  }
  catch (e) {
    return { format, error: e.name + ': ' + e.message };
  }
};