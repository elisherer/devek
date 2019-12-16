import devek from 'devek';
const fieldNames = require('./fieldNames');

const parsePem = buffer => {
  buffer = devek.base64ToUint8Array((buffer + '').split('\r').join('')
    .split('\n')
    .filter(line => line.indexOf('-----'))
    .join(''));
  return parse(buffer);
};

const toDate = buffer => {
  const p = devek.arrayToAscii(buffer).match(/.{2}/g);
  return new Date(`${p[0] >= 70 ? '19' : '20'}${p[0]}-${p[1]}-${p[2]}T${p[3]}:${p[4]}:${p[5]}Z`);
};
const toDictionary = children => children
  .reduce((a, c) => {
    c.value.forEach(val => {
      a[val[0]] = val[1];
    });
    return a;
  }, {});

const tagClasses = [
  'UNIVERSAL',
  'APPLICATION',
  'CONTEXT',
  'PRIVATE',
];

const tagTypes = [
  [
    'reserved','BOOLEAN', 'INTEGER', 'BIT STRING', 'OCTET STRING', 'NULL', 'OBJECT IDENTIFIER', 'ObjectDescriptor',
    'EXTERNAL', 'REAL', 'ENUMERATED', 'EMBEDDED PDV', 'UTF8String', 'RELATIVE-OID', '14', '15', 'SEQUENCE', 'SET',
    'NumericString', 'PrintableString', 'TeletexString', 'VideotexString', 'IA5String', 'UTCTime', 'GeneralizedTime',
    'GraphicString', 'VisibleString', 'GeneralString', 'UniversalString', 'CHARACTER STRING', 'BMPString'
  ],
];

function parse(buffer) {
  const octet1 = buffer[0];
  const octet2 = buffer[1];

  const tagClass = (octet1 & 0b11000000) >> 6;
  const tagClassName = tagClasses[tagClass];
  const tagNumber = octet1 & 0b00011111;
  const tagName = tagTypes[tagClass] ? tagTypes[tagClass][tagNumber] : 'N/A';
  const constructed = !!(octet1 & 0b00100000);

  const lengthBytes = octet2 & 0b01111111,
    long = octet2 & 0b10000000,
    indefiniteLength = octet2 === 0x80;

  let headerLength, data;

  if (!long) { // is 7 bit
    headerLength = 2;
    data = buffer.slice(headerLength, headerLength + lengthBytes);
  } else if (!indefiniteLength) { // is 8 bit to 127 octets
    headerLength = 2 + lengthBytes;
    const dataLength = buffer.slice(2, headerLength).reduce((a,c) => a * 0x100 + c, 0);
    data = buffer.slice(headerLength, headerLength + dataLength);
  } else if (constructed) { // constructed, indefinite-length
    // FIXME: look for end of content
    headerLength = 2;
    data = buffer.slice(headerLength);
    return {
      tagClassName,
      tagClass,
      tagName,
      tagNumber,
      constructed,
      headerLength,
      raw: data,
      value: data
    };
  }

  let children;
  if (constructed) {
    children = parseChildren(data)
  }

  const info = {
    raw: data,
    value: data,
    headerLength,
  };

  if (tagClass === 0) { // UNIVERSAL
    switch (tagNumber) {
      case 1: // BOOLEAN
        info.value = !!(data[0]);
        break;
      case 2: // INTEGER
        if (data[0] === 0 && data.length > 1 && data[1] > 0x7f) {
          data = data.slice(1);
        }
        info.bitSize = data.length * 8;
        if (data.length <= 4) { // parse integer (only if 32bit or lower)
          info.value = data.reduce((a,c) => a * 0x100 + c, 0);
        } else {
          info.value = [...data];
        }
        break;
      case 3: // BIT STRING
        info.numberOfUnusedBits = data[0];
        data = data.slice(1);
        info.bitSize = data.length * 8 - info.numberOfUnusedBits;
        info.value = [...data];
        break;
      case 4: // OCTET STRING
        info.value = [...data];
        break;
      //case 5: //NULL
      case 6: //OBJECT IDENTIFIER
        info.value = ~~(data[0] / 40) + '.' + (data[0] % 40);
        for (let i = 1, val = 0; i < data.length ; i++) {
          val = val * 0x80 + (data[i] & 0x7f);
          if (!(data[i] & 0x80)) {
            info.value += '.' + val;
            val = 0;
          }
        }
        info.oid = info.value;
        info.value = fieldNames[info.value] || info.value;
        break;
      //case 7: // ObjectDescriptor
      //case 8: // EXTERNAL
      //case 9: // REAL
      //case 10: // ENUMERATED
      //case 11: // EMBEDDED PDV
      case 12: // UTF8String
        info.value = devek.arrayToUTF8(data);
        break;
      case 16: //SEQUENCE
      case 17: //SET
        info.value = children.map(x=>x.value);
        break;
      case 18: // NumericString
      case 19: // PrintableString
      case 20: // TeletexString
      case 21: // VideotexString
      case 22: // IA5String
        info.value = devek.arrayToAscii(data);
        break;
      case 23: // UTCTime
      case 24: // GeneralizedTime
        info.value = toDate(data);
        break;
      //case 25: // GraphicString
      case 26: // VisibleString
        info.value = devek.arrayToAscii(data);
        break;
      //case 27: // GeneralString
      case 28: // UniversalString
        info.value = devek.arrayToUnicode(data, true);
        break;
      case 30: // BMPString
        info.value = devek.arrayToUnicode(data);
        break;
      default:
        info.value = null;
    }
  }

  return {
    ...info,
    tagClassName,
    tagClass,
    tagName,
    tagNumber,
    constructed,
    children,
  };
}

function parseChildren(buffer) {
  let pos = 0, lastPos;
  const parts = [];
  do {
    lastPos = pos;
    const info = parse(buffer.slice(pos));
    pos += info.raw.length + info.headerLength;
    parts.push(info);
  } while (pos < buffer.length && pos > lastPos);
  return parts;
}

const ext_keyUsages = ['digitalSignature', 'nonRepudiation', 'keyEncipherment', 'dataEncipherment', 'keyAgreement', 'keyCertSign', 'cRLSign', 'encipherOnly', 'decipherOnly'];
const ext_subjectAltNames = ['otherName', 'rfc822Name', 'dNSName', 'x400Address', 'directoryName', 'ediPartyName', 'uniformResourceIdentifier', 'iPAddress', 'registeredID'];

const parseExtension = (oid, ext) => {
  try {
    switch (oid.oid) {
      case '2.5.29.14': // subjectKeyIdentifier
        return {keyIdentifier: ext.value};
      case '2.5.29.15': { // keyUsage
        let bitmap = ext.value[0];
        const usage = [];
        for (let i = 0; i < 8; i++) {
          (bitmap & (1 << (7 - i))) && usage.push(ext_keyUsages[i]);
        }
        return usage;
      }
      case '2.5.29.17': // subjectAltName
      case '2.5.29.18': // issuerAltName
        return ext.children.reduce((a, c) => {
          a[ext_subjectAltNames[c.tagNumber]] = devek.arrayToAscii(c.value);
          return a;
        }, {});
      case '2.5.29.19': // basicConstraints
        return {cA: !!(ext.value[0]), pathLenConstraint: ext.value[1]};
      case '2.5.29.31': // CRLDistributionPoints
        return ext.children.map(distPoints => distPoints.children.reduce((result, distPoint) => {
          switch (distPoint.tagClass) {
            case 0: //result.distributionPoint; // TODO: add result.distributionPoint
              break;
            case 1: //result.reasons; // TODO: add result.reasons
              break;
            case 2:
              result.cRLIssuer = devek.arrayToAscii(distPoint.children[0].children[0].value);
          }
          return result;
        }, {}));
      case '2.5.29.35': // authorityKeyIdentifier
        return {
          keyIdentifier: ext.value[0] ? ext.value[0] : undefined,
          authorityCertIssuer: ext.value[1],
          authorityCertSerialNumber: ext.value[2]
        };
      case '2.5.29.37': // extKeyUsage
        return ext.children.map(oid => oid.value);
      case '1.3.6.1.5.5.7.1.1': // authorityInfoAccess
        return ext.children.map(c => ({accessMethod: c.value[0], accessLocation: devek.arrayToAscii(c.value[1])}));
      case '1.3.6.1.5.5.7.1.3': // qcStatements
        return ext.children.reduce((a, c) => {
          if (c.children[0].oid === '0.4.0.19495.2') // PSD2 qcStatement
            a[c.value[0]] = {
              rolesOfPSP: c.value[1][0].reduce((b, d) => {
                b[fieldNames[d[0]] || d[0]] = d[1];
                return b;
              }, {}),
              ncaName: c.value[1][1],
              ncaId: c.value[1][2],
            };
          else a[c.value[0]] = c.value.length === 1 ? true : (fieldNames[c.value[1]] || c.value[1]);
          return a;
        }, {});
      default:
        return ext && Object.prototype.hasOwnProperty.call(ext, 'value') ? ext.value : ext;
    }
  }
  catch (err) {
    console.error(err); // eslint-disable-line
    return ext && Object.prototype.hasOwnProperty.call(ext, 'value') ? ext.value : ext;
  }
};

const parsePublicKey = (algorithm, publicKey) => {
  switch (algorithm.children[0].oid) {
    case '1.2.840.113549.1.1.1': { // rsaEncryption
      const keyAsn = parse(publicKey.value);
      return {
        publicKey: `(${keyAsn.children[0].bitSize} bit)`,
        modulus: keyAsn.children[0].raw,
        exponent: keyAsn.value[1],
      };
    }
    case '1.2.840.10045.2.1': { // ecPublicKey
      const size = algorithm.value[1].match(/\d{3}/)[0];
      return {
        publicKey: `(${size} bit)`,
        pub: publicKey.value,
        asn1Oid: algorithm.value[1],
        nistCurve: `P-${size}`,
      };
    }
  }
};

function parseCertificate(pem) {
  try {
    const info = parsePem(pem);
    const tbsCert = info.children[0];

    let idx = -1;
    const version = tbsCert.children[0].tagClass === 2/*context*/ && tbsCert.children[0].tagNumber === 0 /*version*/
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
        parameters: signature.value[1],
      },
      issuer: toDictionary(issuer.children),
      validity: {
        notBefore: validity.value[0],
        notAfter: validity.value[1],
      },
      subject: toDictionary(subject.children),
      subjectPublicKeyInfo: {
        algorithm: subjectPublicKeyInfo.value[0][0],
        publicKey: parsePublicKey(subjectPublicKeyInfo.children[0], subjectPublicKeyInfo.children[1]),
      },
      issuerUniqueID: issuerUniqueID ? issuerUniqueID.value : undefined,
      subjectUniqueID: subjectUniqueID ? subjectUniqueID.value : undefined,
      extensions: extensions ? extensions.children
        .reduce((a, c) => {
          a[c.value[0]] = {
            critical: c.value.length > 2 && typeof c.value[1] === 'boolean' && c.value[1],
            value: parseExtension(c.children[0], parse(c.value[c.value.length - 1]))
          };
          return a;
        }, {}) : undefined,
      signatureAlgorithm: {
        algorithm: info.value[1][0],
        parameters: info.value[1][1],
      },
      signatureValue: info.value[2],
    }
  }
  catch (e) {
    return { error: e.message };
  }
}

export { parseCertificate };
//exports.parseCertificate = parseCertificate;