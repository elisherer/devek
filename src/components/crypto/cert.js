import devek from "../../devek";
const fieldNames = require("./fieldNames");
import { ASN1 } from "./asn1";

const printHex = (array, width = -1, indent = 0) => {
  if (!Array.isArray(array)) return `${array} (0x${array.toString(16)})`;
  let output = array
    .map(x => {
      const byte = x.toString(16);
      return byte.length === 2 ? byte : "0" + byte;
    })
    .join(":");
  if (width === -1 || output.length < width * 3) return output;
  return output.match(new RegExp(`.{1,${width * 3}}`, "g")).join("\n" + " ".repeat(indent));
};

const openSslAliases = {
  countryName: "C",
  domainComponent: "DC",
  stateOrProvinceName: "ST",
  localityName: "L",
  organizationName: "O",
  organizationalUnitName: "OU",
  commonName: "CN",
  pkcs9_emailAddress: "emailAddress"
};

function replacer(key, value) {
  if (Array.isArray(value) && typeof value[0] === "number") {
    return printHex(value);
  }
  return value;
}

const ext_keyUsages = [
  "digitalSignature",
  "nonRepudiation",
  "keyEncipherment",
  "dataEncipherment",
  "keyAgreement",
  "keyCertSign",
  "cRLSign",
  "encipherOnly",
  "decipherOnly"
];
const ext_subjectAltNames = [
  "otherName",
  "rfc822Name",
  "dNSName",
  "x400Address",
  "directoryName",
  "ediPartyName",
  "uniformResourceIdentifier",
  "iPAddress",
  "registeredID"
];

const parseExtension = (oid, ext) => {
  try {
    switch (oid.oid) {
      case "2.5.29.14": // subjectKeyIdentifier
        return { keyIdentifier: ext.value };
      case "2.5.29.15": {
        // keyUsage
        let bitmap = ext.value[0];
        const usage = [];
        for (let i = 0; i < 8; i++) {
          bitmap & (1 << (7 - i)) && usage.push(ext_keyUsages[i]);
        }
        return usage;
      }
      case "2.5.29.17": // subjectAltName
      case "2.5.29.18": // issuerAltName
        return ext.children.reduce((a, c) => {
          a[ext_subjectAltNames[c.tagNumber]] = devek.arrayToAscii(c.value);
          return a;
        }, {});
      case "2.5.29.19": // basicConstraints
        return { cA: !!ext.value[0], pathLenConstraint: ext.value[1] };
      case "2.5.29.31": // CRLDistributionPoints
        return ext.children.map(distPoints =>
          distPoints.children.reduce((result, distPoint) => {
            switch (distPoint.tagClass) {
              case 0: //result.distributionPoint; // TODO: add result.distributionPoint
                break;
              case 1: //result.reasons; // TODO: add result.reasons
                break;
              case 2:
                result.cRLIssuer = devek.arrayToAscii(distPoint.children[0].children[0].value);
            }
            return result;
          }, {})
        );
      case "2.5.29.32": // certificatePolicies
      case "1.3.6.1.5.5.7.1.3": // qcStatements
        return ext.children.reduce((a, c) => {
          if (c.children[0].oid === "0.4.0.19495.2")
            // PSD2 qcStatement
            a[c.value[0]] = {
              rolesOfPSP: c.value[1][0].reduce((b, d) => {
                b[fieldNames[d[0]] || d[0]] = d[1];
                return b;
              }, {}),
              ncaName: c.value[1][1],
              ncaId: c.value[1][2]
            };
          else a[c.value[0]] = c.value.length === 1 ? true : fieldNames[c.value[1]] || c.value[1];
          return a;
        }, {});
      case "2.5.29.35": // authorityKeyIdentifier
        return {
          keyIdentifier: ext.value[0] ? ext.value[0] : undefined,
          authorityCertIssuer: ext.value[1],
          authorityCertSerialNumber: ext.value[2]
        };
      case "2.5.29.37": // extKeyUsage
        return ext.children.map(oid => oid.value);
      case "1.3.6.1.5.5.7.1.1": // authorityInfoAccess
        return ext.children.map(c => ({
          accessMethod: c.value[0],
          accessLocation: devek.arrayToAscii(c.value[1])
        }));
      default:
        return ext && Object.prototype.hasOwnProperty.call(ext, "value") ? ext.value : ext;
    }
  } catch (err) {
    console.error(err); // eslint-disable-line
    return ext && Object.prototype.hasOwnProperty.call(ext, "value") ? ext.value : ext;
  }
};

const parsePublicKey = (algorithm, publicKey) => {
  switch (algorithm.children[0].oid) {
    case "1.2.840.113549.1.1.1": {
      // rsaEncryption
      const keyAsn = ASN1.parse(publicKey.value);
      return {
        publicKey: `(${keyAsn.children[0].bitSize} bit)`,
        modulus: keyAsn.children[0].raw,
        exponent: keyAsn.value[1]
      };
    }
    case "1.2.840.10045.2.1": {
      // ecPublicKey
      const size = algorithm.value[1].match(/\d{3}/)[0];
      return {
        publicKey: `(${size} bit)`,
        pub: publicKey.value,
        asn1Oid: algorithm.value[1],
        nistCurve: `P-${size}`
      };
    }
  }
};

/**
 *
 * @param pem
 * @returns {{serialNumber: *, issuerUniqueID: (*|undefined), signature: {parameters: *, algorithm: *}, subject: *, version: (*|number), subjectUniqueID: (*|undefined), issuer: *, signatureAlgorithm: {parameters: *, algorithm: *}, extensions: (*|undefined), subjectPublicKeyInfo: {publicKey: ({publicKey: string, modulus: *, exponent: *}|{asn1Oid: *, publicKey: string, nistCurve: string, pub: *}), algorithm: *}, validity: {notAfter: *, notBefore: *}, buffer: *, signatureValue: *}|{error: *}}
 */
export const parseCertificate = pem => {
  try {
    const { buffer, info } = ASN1.parsePEM(pem);
    const tbsCert = info.children[0];

    let idx = -1;
    const version =
        tbsCert.children[0].tagClass === 2 /*context*/ &&
        tbsCert.children[0].tagNumber === 0 /*version*/
          ? tbsCert.children[++idx].children[0].value
          : 0, // default is v1
      serialNumber = tbsCert.children[++idx],
      signature = tbsCert.children[++idx],
      issuer = tbsCert.children[++idx],
      validity = tbsCert.children[++idx],
      subject = tbsCert.children[++idx],
      subjectPublicKeyInfo = tbsCert.children[++idx];

    let issuerUniqueID = null,
      subjectUniqueID = null,
      extensions = null;
    for (let i = idx; i < tbsCert.children.length; i++) {
      if (tbsCert.children[i].tagClass !== 2) continue; // not context-specific
      switch (tbsCert.children[i].tagNumber) {
        case 1:
          issuerUniqueID = tbsCert.children[i].children[0];
          break;
        case 2:
          subjectUniqueID = tbsCert.children[i].children[0];
          break;
        case 3:
          extensions = tbsCert.children[i].children[0];
          break;
      }
    }

    return {
      version: version.value || version || 0,
      serialNumber: serialNumber.value,
      signature: {
        algorithm: signature.value[0],
        parameters: signature.value[1]
      },
      issuer: ASN1.toArray(issuer.children),
      validity: {
        notBefore: validity.value[0],
        notAfter: validity.value[1]
      },
      subject: ASN1.toArray(subject.children),
      subjectPublicKeyInfo: {
        algorithm: subjectPublicKeyInfo.value[0][0],
        publicKey: parsePublicKey(
          subjectPublicKeyInfo.children[0],
          subjectPublicKeyInfo.children[1]
        )
      },
      issuerUniqueID: issuerUniqueID ? issuerUniqueID.value : undefined,
      subjectUniqueID: subjectUniqueID ? subjectUniqueID.value : undefined,
      extensions: extensions
        ? extensions.children.reduce((a, c) => {
            a[c.value[0]] = {
              critical: c.value.length > 2 && typeof c.value[1] === "boolean" && c.value[1],
              value: parseExtension(c.children[0], ASN1.parse(c.value[c.value.length - 1]))
            };
            return a;
          }, {})
        : undefined,
      signatureAlgorithm: {
        algorithm: info.value[1][0],
        parameters: info.value[1][1]
      },
      signatureValue: info.value[2],
      buffer
    };
  } catch (e) {
    return { error: e.message };
  }
};

export const prettyCert = cert => {
  const publicKey =
    cert.subjectPublicKeyInfo.algorithm === "rsaEncryption"
      ? `
                Public-Key: ${cert.subjectPublicKeyInfo.publicKey.publicKey}
                Modulus:
                    ${printHex(cert.subjectPublicKeyInfo.publicKey.modulus, 15, 20)}
                Exponent: ${printHex(cert.subjectPublicKeyInfo.publicKey.exponent)}`
      : `
                Public-Key: ${cert.subjectPublicKeyInfo.publicKey.publicKey}
                pub:
                    ${printHex(cert.subjectPublicKeyInfo.publicKey.pub, 15, 20)}
                ASN1 OID: ${cert.subjectPublicKeyInfo.publicKey.asn1Oid}
                NIST CURVE: ${cert.subjectPublicKeyInfo.publicKey.nistCurve}`;

  let extensions = "";
  if (cert.extensions) {
    extensions = `
        X509v3 extensions:\n`;
    Object.keys(cert.extensions).forEach(ext => {
      extensions += `            ${ext}: ${cert.extensions[ext].critical ? "critical" : ""}
                ${JSON.stringify(cert.extensions[ext].value, replacer, 2).replace(
                  /\n/g,
                  "\n                "
                )}\n`;
    });
  }

  return `Certificate:
    Data:
        Version: ${cert.version + 1} (0x${cert.version})
        Serial Number:
            ${printHex(cert.serialNumber)}
    Signature Algorithm: ${cert.signature.algorithm}
        Issuer: ${cert.issuer.map(kv => (openSslAliases[kv[0]] || kv[0]) + "=" + kv[1]).join(", ")}
        Validity
            Not Before: ${cert.validity.notBefore.toGMTString()}
            Not After : ${cert.validity.notAfter.toGMTString()}
        Subject: ${cert.subject
          .map(kv => (openSslAliases[kv[0]] || kv[0]) + "=" + kv[1])
          .join(", ")}
        Subject Public Key Info:
            Public Key Algorithm: ${cert.subjectPublicKeyInfo.algorithm}${publicKey}${extensions}
    Signature Algorithm: ${cert.signatureAlgorithm.algorithm}
         ${printHex(cert.signatureValue, 18, 9)}`;
};
