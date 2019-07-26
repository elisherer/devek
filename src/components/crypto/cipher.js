import devek from 'devek';
import md5 from './md5';

const crypto = devek.crypto;
devek.md5 = md5;

const OPENSSL_MAGIC = devek.stringToUint8Array("Salted__"),
  SALT_SIZE = 8;

/**
 * Key derivation function using MD5
 * @param passphrase {string}
 * @param salt {Uint8Array|Boolean}
 * @param keySize {Number}
 * @param ivSize {Number}
 * @param count (Number) number of iterations to run hash functions
 * @returns {{rawKey: Uint8Array, iv: Uint8Array}}
 */
const EVP_BytesToKey = (passphrase, salt, keySize, ivSize, count) => {
  const pass = devek.stringToUint8Array(passphrase);

  let passAndSalt = salt ? devek.concatUint8Array(pass, salt) : pass;
  let hash = md5(passAndSalt);
  for (let i = 1; i < count ; i++) {
    hash = md5(hash);
  }
  let keyAndIv = hash;
  while (keyAndIv.length < keySize + ivSize) {
    hash = md5(devek.concatUint8Array(hash, passAndSalt));
    for (let i = 1; i < count ; i++) {
      hash = md5(hash);
    }
    keyAndIv = devek.concatUint8Array(keyAndIv, hash);
  }
  return {
    key: keyAndIv.slice(0, keySize),
    iv: keyAndIv.slice(keySize, keySize + ivSize)
  };
};

const deriveAESCryptoKeyAndIV = async (alg, passphrase, useSalt, generateSalt, salt, usage) => {
  if (useSalt) {
    if (generateSalt) salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
    else if (salt.length < SALT_SIZE) { // not enough salt
      const paddedSalt = new Uint8Array(Array.from({length: SALT_SIZE}, () => 0));
      paddedSalt.set(salt, 0);
      salt = paddedSalt;
    } else if (salt && salt.length > SALT_SIZE) { // too much salt
      salt = salt.slice(0, SALT_SIZE);
    }
  }
  const derived = EVP_BytesToKey(passphrase, useSalt && salt, 32, 16, 1);

  return {
    cryptoKey: await crypto.subtle.importKey("raw", derived.key, alg, true, [usage]),
    iv: derived.iv,
    salt
  };
};

const getAesParams = (alg, iv) => (alg === 'AES-CTR' ? {
  name: alg,
  counter: iv,
  length: 64
} : {
  name: alg,
  iv
});

const importRSAOAEPCryptoKey = (jwk, usage) => crypto.subtle.importKey(
  "jwk",
  jwk,
  {
    name: "RSA-OAEP",
    hash: "SHA" + (jwk.alg.substr(8) || "-1")
  },
  true,
  [usage]
);

const getRsaOaepParams = (alg, label) => ({
  name: alg,
  label
});

const buildKDFOutputAsync = async (alg, iv, useSalt, salt, cryptoKey) => [
  useSalt && ('salt    = ' + devek.arrayToHexString(salt)),
  'key     = ' + devek.arrayToHexString(new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKey))),
  (alg === 'AES-CTR' ? 'counter = ' : 'iv      = ') + devek.arrayToHexString(iv)
].filter(Boolean).join('\n');

export const cipherEncrypt = async (alg, data, useKDF, key, iv, passphrase, useSalt, generateSalt, salt, jwk) => {
  try {
    const isAES = alg.startsWith('AES');
    let cryptoKey, options;
    if (isAES) {
      if (useKDF) {
        const keyAndIV = await deriveAESCryptoKeyAndIV(alg, passphrase, useSalt, generateSalt, salt, 'encrypt');
        cryptoKey = keyAndIV.cryptoKey;
        iv = keyAndIV.iv;
        salt = keyAndIV.salt;
      } else {
        cryptoKey = await crypto.subtle.importKey("raw", new Uint8Array(devek.hexStringToArray(key)), alg, false, ['encrypt']);
        iv = new Uint8Array(devek.hexStringToArray(iv));
      }
      options = getAesParams(alg, iv);
    }
    else {
      cryptoKey = await importRSAOAEPCryptoKey(JSON.parse(jwk), 'encrypt');
      options = getRsaOaepParams(alg);
    }

    const encrypted = new Uint8Array(await crypto.subtle.encrypt(options, cryptoKey,
      devek.stringToUint8Array(data)
    ));

    return {
      kdf: useKDF && isAES ? await buildKDFOutputAsync(alg, iv, useSalt, salt, cryptoKey) : '',
      output: isAES && useKDF && useSalt ? devek.concatUint8Array(OPENSSL_MAGIC, salt, encrypted) : encrypted
    };
  }
  catch (e) {
    return {kdf: '', error: e.name + ': ' + e.message};
  }
};

export const cipherDecrypt = async (alg, data, useKDF, key, iv, passphrase, useSalt, generateSalt, salt, jwk) => {
  try {
    const isAES = alg.startsWith('AES');

    // extract salt from data if there
    const decoded = devek.base64ToUint8Array(data);
    const salted = decoded.length > OPENSSL_MAGIC.length
      && OPENSSL_MAGIC.every((x, i) => decoded[i] === x);
    if (salted) {
      useSalt = true;
      salt = decoded.slice(OPENSSL_MAGIC.length, OPENSSL_MAGIC.length + 8);
    }
    const encrypted = salted ? decoded.slice(OPENSSL_MAGIC.length + 8) : decoded;

    // get key and options
    let cryptoKey, options;
    if (isAES) {
      if (useKDF) {
        const derived = await deriveAESCryptoKeyAndIV(alg, passphrase, useSalt, false, salt, 'decrypt');
        cryptoKey = derived.cryptoKey;
        iv = derived.iv;
        salt = derived.salt;
      } else {
        cryptoKey = await crypto.subtle.importKey("raw", new Uint8Array(devek.hexStringToArray(key)), alg, true, ['decrypt']);
        iv = new Uint8Array(devek.hexStringToArray(iv));
      }
      options = getAesParams(alg, iv);
    } else {
      cryptoKey = await importRSAOAEPCryptoKey(JSON.parse(jwk), 'decrypt');
      options = getRsaOaepParams(alg);
    }

    const decrypted = new Uint8Array(await crypto.subtle.decrypt(options, cryptoKey, encrypted));

    return {
      kdf: useKDF && isAES ? await buildKDFOutputAsync(alg, iv, useSalt, salt, cryptoKey) : '',
      output: decrypted
    };
  }
  catch (e) {
    return {kdf: '', error: e.name + ': ' + e.message};
  }
};

export const cipherFormat = (array, format) =>
  format === 'Base64'
    ? devek.arrayToBase64(array)
    : format === 'UTF-8'
    ? devek.arrayToUTF8(array)
    : devek.arrayToHexString(array);