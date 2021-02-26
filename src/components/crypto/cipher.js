import devek from "devek";
import md5 from "./md5";
import { ASN1 } from "./asn1";
import { pkcs1ToJWK } from "./crypto";

const crypto = devek.crypto;
devek.md5 = md5;

const OPENSSL_MAGIC = devek.stringToUint8Array("Salted__"),
  SALT_SIZE = 8,
  IV_SIZE = 16;

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
  for (let i = 1; i < count; i++) {
    hash = md5(hash);
  }
  let keyAndIv = hash;
  while (keyAndIv.length < keySize + ivSize) {
    hash = md5(devek.concatUint8Array(hash, passAndSalt));
    for (let i = 1; i < count; i++) {
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
    else if (salt.length < SALT_SIZE) {
      // not enough salt
      const paddedSalt = new Uint8Array(Array.from({ length: SALT_SIZE }, () => 0));
      paddedSalt.set(salt, 0);
      salt = paddedSalt;
    } else if (salt && salt.length > SALT_SIZE) {
      // too much salt
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

const getAesParams = (alg, iv) =>
  alg === "AES-CTR"
    ? {
        name: alg,
        counter: iv,
        length: 64
      }
    : {
        name: alg,
        iv
      };

const importRSAOAEPCryptoKey = (input, usage) => {
  try {
    const jwk = JSON.parse(input);
    return crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSA-OAEP",
        hash: "SHA" + (jwk.alg.substr(8) || "-1")
      },
      true,
      [usage]
    );
  } catch (e) {
    if (e instanceof SyntaxError) {
      // probably not JWK, try PEM
      const pem = ASN1.pemToUint8Array(input);
      // Check if PKCS#1
      if (input.includes("BEGIN RSA ")) {
        const jwk = pkcs1ToJWK(pem);
        return crypto.subtle.importKey(
          "jwk",
          jwk,
          {
            name: "RSA-OAEP", // guess
            hash: "SHA-512" // guess
          },
          true,
          [usage]
        );
      }
      // try X.509 / PKCS#8
      return crypto.subtle.importKey(
        usage === "encrypt" ? "spki" : "pkcs8",
        ASN1.pemToUint8Array(input),
        {
          name: "RSA-OAEP", // guess
          hash: "SHA-512" // guess
        },
        true,
        [usage]
      );
    }
  }
};

const getRsaOaepParams = (name, label) => {
  const params = { name };
  if (label) params.label = label;
  return params;
};

const buildIVOutput = (alg, iv) =>
  (alg === "AES-CTR" ? "counter = " : "iv      = ") + devek.arrayToHexString(iv);

const buildPropertiesOutputAsync = async (alg, iv, useSalt, salt, cryptoKey) =>
  [
    useSalt && "salt    = " + devek.arrayToHexString(salt),
    "key     = " +
      devek.arrayToHexString(new Uint8Array(await crypto.subtle.exportKey("raw", cryptoKey))),
    buildIVOutput(alg, iv)
  ]
    .filter(Boolean)
    .join("\n");

export const cipherEncrypt = async (
  alg,
  data,
  useKDF,
  position,
  key,
  iv,
  passphrase,
  useSalt,
  generateSalt,
  salt,
  encKey
) => {
  try {
    const isAES = alg.startsWith("AES");
    let cryptoKey,
      options,
      ivGenerated = false,
      inputLimit = Infinity;
    if (isAES) {
      if (useKDF) {
        const keyAndIV = await deriveAESCryptoKeyAndIV(
          alg,
          passphrase,
          useSalt,
          generateSalt,
          salt,
          "encrypt"
        );
        cryptoKey = keyAndIV.cryptoKey;
        iv = keyAndIV.iv;
        salt = keyAndIV.salt;
      } else {
        cryptoKey = await crypto.subtle.importKey(
          "raw",
          new Uint8Array(devek.hexStringToArray(key)),
          alg,
          false,
          ["encrypt"]
        );
        if (!iv) {
          iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
          ivGenerated = true;
        } else iv = new Uint8Array(devek.hexStringToArray(iv));
      }
      options = getAesParams(alg, iv);
    } else {
      cryptoKey = await importRSAOAEPCryptoKey(encKey, "encrypt");
      inputLimit = cryptoKey.algorithm.modulusLength / 8 - (2 * 160) / 8 - 2;
      options = getRsaOaepParams(alg);
    }

    const dataArray = devek.stringToUint8Array(data);
    let encrypted;
    try {
      encrypted = new Uint8Array(await crypto.subtle.encrypt(options, cryptoKey, dataArray));
    } catch (e) {
      if (dataArray.length > inputLimit) {
        throw new Error(
          `Input is over the maximum limit of ${inputLimit} bytes (*it might be lower)`
        );
      } else {
        throw e;
      }
    }
    if (isAES && useKDF && useSalt) {
      encrypted = devek.concatUint8Array(OPENSSL_MAGIC, salt, encrypted);
    }

    if (isAES && position !== "None") {
      if (position === "Start") {
        encrypted = devek.concatUint8Array(iv, encrypted);
      } else {
        encrypted = devek.concatUint8Array(encrypted, iv);
      }
    }

    let properties = "";
    if (isAES) {
      if (ivGenerated) {
        properties = buildIVOutput(alg, iv);
      } else if (useKDF) {
        properties = await buildPropertiesOutputAsync(alg, iv, useSalt, salt, cryptoKey);
      }
    }

    return {
      properties,
      output: encrypted
    };
  } catch (e) {
    console.error(e);
    return { properties: "", error: e.name + ": " + e.message };
  }
};

export const cipherDecrypt = async (
  alg,
  data,
  useKDF,
  position,
  key,
  iv,
  passphrase,
  useSalt,
  generateSalt,
  salt,
  decKey
) => {
  try {
    const isAES = alg.startsWith("AES");

    // extract salt from data if there
    let encrypted = devek.base64ToUint8Array(data);
    if (
      useKDF &&
      encrypted.length > OPENSSL_MAGIC.length &&
      OPENSSL_MAGIC.every((x, i) => encrypted[i] === x)
    ) {
      useSalt = true;
      salt = encrypted.slice(OPENSSL_MAGIC.length, OPENSSL_MAGIC.length + 8);
      encrypted = encrypted.slice(OPENSSL_MAGIC.length + 8);
    }

    let ivExtracted = false;
    if (!useKDF && isAES) {
      ivExtracted = true;
      if (position === "Start") {
        iv = encrypted.slice(0, IV_SIZE);
        encrypted = encrypted.slice(-(encrypted.length - IV_SIZE));
      } else if (position === "End") {
        iv = encrypted.slice(-IV_SIZE);
        encrypted = encrypted.slice(0, encrypted.length - IV_SIZE);
      }
    }

    // get key and options
    let cryptoKey, options;
    if (isAES) {
      if (useKDF) {
        const derived = await deriveAESCryptoKeyAndIV(
          alg,
          passphrase,
          useSalt,
          false,
          salt,
          "decrypt"
        );
        cryptoKey = derived.cryptoKey;
        iv = derived.iv;
        salt = derived.salt;
      } else {
        cryptoKey = await crypto.subtle.importKey(
          "raw",
          new Uint8Array(devek.hexStringToArray(key)),
          alg,
          true,
          ["decrypt"]
        );
        if (typeof iv === "string") iv = new Uint8Array(devek.hexStringToArray(iv));
      }
      options = getAesParams(alg, iv);
    } else {
      cryptoKey = await importRSAOAEPCryptoKey(decKey, "decrypt");
      options = getRsaOaepParams(alg);
    }

    const decrypted = new Uint8Array(await crypto.subtle.decrypt(options, cryptoKey, encrypted));

    let properties = "";
    if (isAES) {
      if (ivExtracted) {
        properties = buildIVOutput(alg, iv);
      } else if (useKDF) {
        properties = await buildPropertiesOutputAsync(alg, iv, useSalt, salt, cryptoKey);
      }
    }

    return {
      properties,
      output: decrypted
    };
  } catch (e) {
    console.error(e);
    return { properties: "", error: e.name + ": " + e.message };
  }
};
