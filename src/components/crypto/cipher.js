import devek from 'devek';
import MD5 from './md5';
const crypto = devek.crypto;

const OPENSSL_MAGIC = devek.stringToUint8Array("Salted__");

/**
 * Key derivation function using MD5
 * @param passphrase {string}
 * @param salt {Uint8Array}
 * @param keySize {Number}
 * @param ivSize {Number}
 * @returns {{rawKey: Uint8Array, iv: Uint8Array}}
 */
const kdfMD5 = (passphrase, salt, keySize, ivSize) => {
  const pass = devek.stringToUint8Array(passphrase);

  let passAndSalt = salt ? devek.concatUint8Array(pass, salt) : pass;
  let hash = MD5(passAndSalt);
  let keyAndIv = hash;
  while (keyAndIv.byteLength < keySize + ivSize) {
    hash = MD5(devek.concatUint8Array(hash, passAndSalt));
    keyAndIv = devek.concatUint8Array(keyAndIv, hash);
  }

  const rawKey = keyAndIv.slice(0, keySize),
    iv = keyAndIv.slice(keySize, keySize + ivSize);

  return { rawKey, iv };
};

export const cipherEncrypt = async (data, passphrase, salt) => {
  try {
    if (salt === '') salt = crypto.getRandomValues(new Uint8Array(8));
    if ((salt.length || salt.byteLength) < 8) {
      const paddedSalt = new Uint8Array(Array.from({ length: 8 }, () => 0) );
      paddedSalt.set(salt, 0);
      salt = paddedSalt;
    }
    if ((salt.length || salt.byteLength) > 8) {
      salt = salt.slice(0, 8);
    }
    const { rawKey, iv } = kdfMD5(passphrase, salt, 32, 16);

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

    const {rawKey, iv} = kdfMD5(passphrase, salt, 32, 16);

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

    const output = devek.arrayToString(decrypted);
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