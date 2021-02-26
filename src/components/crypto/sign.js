import devek from "devek";
import { ASN1 } from "./asn1";
import { getECCurveNameFromPEM, pkcs1ToJWK } from "./crypto";

const crypto = devek.crypto;

const importSignVerifyCryptoKey = (alg, hashAlg, input, usage) => {
  const algorithm = {
    name: alg,
    hash: hashAlg
  };
  if (alg === "HMAC") {
    return crypto.subtle.importKey("raw", input, algorithm, true, [usage]);
  }
  try {
    const jwk = JSON.parse(input);
    if (jwk.crv) {
      algorithm.namedCurve = jwk.crv;
      delete algorithm.hash;
    }
    return crypto.subtle.importKey("jwk", jwk, algorithm, true, [usage]);
  } catch (e) {
    if (e instanceof SyntaxError) {
      // probably not JWK, try PEM
      const pem = ASN1.pemToUint8Array(input);
      // Check if PKCS#1
      if (input.includes("BEGIN RSA ")) {
        const jwk = pkcs1ToJWK(pem);
        return crypto.subtle.importKey("jwk", jwk, algorithm, true, [usage]);
      }
      // try X.509 / PKCS#8
      const namedCurve = getECCurveNameFromPEM(pem);
      if (namedCurve) algorithm.namedCurve = namedCurve;
      return crypto.subtle.importKey(usage === "verify" ? "spki" : "pkcs8", pem, algorithm, true, [
        usage
      ]);
    }
  }
};

const getAlgorithm = (name, hashAlg) => {
  const params = { name };
  if (name === "RSA-PSS") params.saltLength = parseInt(hashAlg.substr(4)) / 8;
  if (name === "ECDSA") params.hash = hashAlg;
  return params;
};

export const sign = async (alg, hashAlg, key, data) => {
  try {
    const cryptoKey = await importSignVerifyCryptoKey(alg, hashAlg, key, "sign"),
      algorithm = getAlgorithm(alg, hashAlg);
    const dataArray = devek.stringToUint8Array(data);

    const signature = new Uint8Array(await crypto.subtle.sign(algorithm, cryptoKey, dataArray));
    return {
      output: signature
    };
  } catch (e) {
    console.error(e);
    return { error: e.name + ": " + e.message };
  }
};

export const verify = async (alg, hashAlg, key, signature, data) => {
  try {
    const cryptoKey = await importSignVerifyCryptoKey(alg, hashAlg, key, "verify"),
      algorithm = getAlgorithm(alg, hashAlg);

    const dataArray = devek.stringToUint8Array(data);

    const sig = devek.base64UrlToUint8Array(signature);
    const verified = await crypto.subtle.verify(algorithm, cryptoKey, sig, dataArray);

    return {
      output: verified
    };
  } catch (e) {
    console.error(e);
    return { error: e.name + ": " + e.message };
  }
};
