import devek from 'devek';
import md5 from './md5';
const crypto = devek.crypto;
devek.md5 = md5;

const OPENSSL_MAGIC = devek.stringToUint8Array("Salted__");

/**
 * Key derivation function using MD5
 * @param passphrase {string}
 * @param salt {Uint8Array}
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
  while (keyAndIv.byteLength < keySize + ivSize) {
    hash = md5(devek.concatUint8Array(hash, passAndSalt));
    for (let i = 1; i < count ; i++) {
      hash = md5(hash);
    }
    keyAndIv = devek.concatUint8Array(keyAndIv, hash);
  }

  const rawKey = keyAndIv.slice(0, keySize),
    iv = keyAndIv.slice(keySize, keySize + ivSize);

  return { rawKey, iv };
};

export const cipherEncrypt = async (data, passphrase, salt) => {
  try {
    if (salt === '') salt = crypto.getRandomValues(new Uint8Array(8));
    if (salt && (salt.length || salt.byteLength) < 8) {
      const paddedSalt = new Uint8Array(Array.from({ length: 8 }, () => 0) );
      paddedSalt.set(salt, 0);
      salt = paddedSalt;
    }
    else if (salt && (salt.length || salt.byteLength) > 8) {
      salt = salt.slice(0, 8);
    }
    const { rawKey, iv } = EVP_BytesToKey(passphrase, salt, 32, 16, 1);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      rawKey,
      "AES-CBC",
      true,
      ["encrypt", "decrypt"]
    );

    const encrypted = new Uint8Array(await crypto.subtle.encrypt(
      {
        name: "AES-CBC",
        iv
      },
      cryptoKey,
      devek.stringToUint8Array(data)
    ));

    const output = devek.arrayToBase64(salt
      ? devek.concatUint8Array(OPENSSL_MAGIC, salt, encrypted)
      : encrypted);

    const key = new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKey));

    const meta = [
      salt ? ('salt = ' + devek.arrayToHexString(salt)) : null,
      'key  = ' + devek.arrayToHexString(key),
      'iv   = ' + devek.arrayToHexString(iv)
    ].filter(Boolean).join('\n');

    return { meta, output };
  }
  catch (e) {
    return {meta: e.message, output: ''};
  }
};

export const cipherDecrypt = async (data, passphrase, salt) => {
  try {
    const decoded = devek.base64ToUint8Array(data);
    const salted = decoded.byteLength > OPENSSL_MAGIC.byteLength
      && OPENSSL_MAGIC.every((x, i) => decoded[i] === x);

    if (salted) salt = decoded.slice(OPENSSL_MAGIC.byteLength, OPENSSL_MAGIC.byteLength + 8);

    const {rawKey, iv} = EVP_BytesToKey(passphrase, salt, 32, 16, 1);

    const encrypted = salted ? decoded.slice(OPENSSL_MAGIC.byteLength + 8) : decoded;

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      rawKey,
      "AES-CBC",
      true,
      ["encrypt", "decrypt"]
    );

    const decrypted = new Uint8Array(await crypto.subtle.decrypt(
      {
        name: "AES-CBC",
        iv
      },
      cryptoKey,
      encrypted
    ));

    const de = new TextDecoder();
    const output = de.decode(decrypted);
    const key = new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKey));

    const meta = [
      salt ? ('salt = ' + devek.arrayToHexString(salt)) : null,
      'key  = ' + devek.arrayToHexString(key),
      'iv   = ' + devek.arrayToHexString(iv)
    ].filter(Boolean).join('\n');

    return {meta, output};
  }
  catch (e) {
    return {meta: e.name + ': ' +e.message, output: ''};
  }
};