import devek from "devek";
import { ASN1, ASN1_Encode, ASN1_OID, ASN1_SEQUENCE } from "./asn1";

export const getNamedCurveFromSEC1 = pem => {
  try {
    const parsed = ASN1.parse(pem);
    // find first array in sequence (in public 1st, in private 2nd)
    const oidArray = parsed.value.find(x => Array.isArray(x));
    // second value is curve name
    return "P-" + oidArray[1].match(/\d{3}/)[0];
  } catch (e) {
    return undefined;
  }
};

export const spkiToPKCS1 = spki => {
  const parsedSpki = ASN1.parse(spki);
  //const alg = parsedSpki.value[0][0].startsWith("rsa") ? "RSA" : "EC";
  const pkcs1Container = parsedSpki.children.find(x => x.tagNumber === ASN1.BIT_STRING);
  const buffer = pkcs1Container.value;
  return devek.arrayToPEM(buffer, "RSA PUBLIC KEY");
};

/**
 * PKCS-8 to PKCS-1 (RSA) / SEC-1 (EC)
 * @param pkcs8 {Uint8Array}
 * @returns {string}
 */
export const pkcs8ToPKCS1 = pkcs8 => {
  const parsedPkcs8 = ASN1.parse(pkcs8);
  const alg = parsedPkcs8.value[1][0].startsWith("rsa") ? "RSA" : "EC";
  const pkcs1Container = parsedPkcs8.children.find(x => x.tagNumber === ASN1.OCTET_STRING);

  let buffer = pkcs1Container.value;

  if (alg === "EC") {
    const parsedPkcs1 = ASN1.parse(pkcs1Container.value);
    const octet = parsedPkcs1.children.find(x => x.tagNumber === ASN1.OCTET_STRING);
    const sequenceSize = pkcs8[2] & 0b10000000 ? 1 : 2;
    const oidBuffer = parsedPkcs8.children.find(x => x.tagNumber === ASN1.SEQUENCE).children.pop();
    // we need to copy OID to the sequence
    buffer = ASN1_SEQUENCE(
      buffer.slice(1 + sequenceSize, octet.offset + octet.headerLength + octet.value.length),
      ASN1_Encode(0xa0, ASN1_OID(oidBuffer.oid)),
      buffer.slice(octet.offset + octet.headerLength + octet.value.length)
    );
  }
  return devek.arrayToPEM(buffer, alg + " PRIVATE KEY");
};

export const pkcs1ToJWK = pkcs1 => {
  const parsedPkcs1 = ASN1.parse(pkcs1);
  if (parsedPkcs1.value.length !== 2 && parsedPkcs1.value.length !== 9) {
    throw new Error("Can't parse PKCS1 PEM");
  }
  if (parsedPkcs1.value.length === 2) {
    // Public
    return {
      kty: "RSA",
      n: devek.arrayToBase64Url(parsedPkcs1.value[0]),
      e: devek.arrayToBase64Url(
        devek.hexStringToArray(parsedPkcs1.value[1].toString(16).padStart(6, "0"))
      )
    };
  } else {
    // Private (assume length of 9)
    if (parsedPkcs1.value[0] !== 0) {
      throw new Error("Bad PKCS1 PEM");
    }
    return {
      kty: "RSA",
      n: devek.arrayToBase64Url(parsedPkcs1.value[1]),
      e: devek.arrayToBase64Url(
        devek.hexStringToArray(parsedPkcs1.value[2].toString(16).padStart(6, "0"))
      ),
      d: devek.arrayToBase64Url(parsedPkcs1.value[3]),
      p: devek.arrayToBase64Url(parsedPkcs1.value[4]),
      q: devek.arrayToBase64Url(parsedPkcs1.value[5]),
      dp: devek.arrayToBase64Url(parsedPkcs1.value[6]),
      dq: devek.arrayToBase64Url(parsedPkcs1.value[7]),
      qi: devek.arrayToBase64Url(parsedPkcs1.value[8])
    };
  }
};
