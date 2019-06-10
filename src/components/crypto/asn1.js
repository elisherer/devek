const fieldNames = require('./fieldNames');

const parsePem = buffer => {
  buffer = new Uint8Array(
    Buffer.from(
    (buffer + '').split('\r').join('')
      .split('\n')
      .filter(line => line.indexOf('-----'))
      .join(''), 'base64').toString('binary').split('').map(c => c.charCodeAt()));
  return parse(buffer);
};

const toHex = buffer => [...buffer].map(x=>{
  const h = x.toString(16);
  return h.length < 2 ? ('0' + h) : h;
}).join('');

const toASCII = buffer => String.fromCharCode.apply(null, buffer);
const toUTF8 = buffer => {
  let s = "";
  for (let i = 0; i < buffer.length ; i++) {
    const c = buffer[i];
    if (c < 128)
      s += String.fromCharCode(c);
    else if ((c > 191) && (c < 224))
      s += String.fromCharCode(((c & 0x1F) << 6) | (buffer[i++] & 0x3F));
    else
      s += String.fromCharCode(((c & 0x0F) << 12) | ((buffer[i++] & 0x3F) << 6) | (buffer[i++] & 0x3F));
  }
  return s;
};
const toDate = buffer => {
  const p = toASCII(buffer).match(/.{1,2}/g);
  return new Date(`${p[0] >= 70 ? '19' : '20'}${p[0]}-${p[1]}-${p[2]}T${p[3]}:${p[4]}:${p[5]}`);
};
const toDictionary = children => children
  .reduce((a, c) => {
    a[c.children[0].children[0].value] = c.children[0].children[1].value;
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
  const type = octet1 & 0b00011111;
  const typeName = tagTypes[tagClass] ? tagTypes[tagClass][type] : 'N/A';
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
      typeName,
      type,
      constructed,
      headerLength,
      dl: data.length,
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
  };

  if (tagClass === 0) { // UNIVERSAL
    switch (type) {
      case 1: // BOOLEAN
        info.value = !!(data[0]);
        break;
      case 2: // INTEGER
        info.bitSize = (data.length > 1 && data[1] > 0x7f ? data.length - 1 : data.length) * 8;
        if (data.length <= 4) { // parse integer (only if 32bit or lower)
          info.value = data.reduce((a,c) => a * 0x100 + c, 0);
        } else {
          info.value = `(${info.bitSize} bit)`;
        }
        break;
      case 3: // BIT STRING
        info.numberOfUnusedBits = data[0];
        data = data.slice(1);
        info.value = data;
        break;
      case 4: // OCTET STRING
        info.value = data;
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
        info.value = toUTF8(data);
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
        info.value = toASCII(data);
        break;
      case 23: // UTCTime
      case 24: // GeneralizedTime
        info.value = toDate(data);
        break;
      //case 25: // GraphicString
      case 26: // VisibleString
        info.value = toASCII(data);
        break;
      //case 27: // GeneralString
      //case 28: // UniversalString
      //case 30: // BMPString
      default:
        info.value = null;
    }
  }

  Object.assign(info, {
    tagClassName,
    tagClass,
    typeName,
    type,
    constructed,
    children,
    headerLength,
    dl: data.length,
  });

  return info;
}

function parseChildren(buffer) {
  let pos = 0, lastPos;
  const parts = [];
  do {
    lastPos = pos;
    const info = parse(buffer.slice(pos));
    pos += info.dl + info.headerLength;
    parts.push(info);
  } while (pos < buffer.length && pos > lastPos);
  return parts;
}

const ext_keyUsages = ['digitalSignature', 'nonRepudiation', 'keyEncipherment', 'dataEncipherment', 'keyAgreement', 'keyCertSign', 'cRLSign', 'encipherOnly', 'decipherOnly'];
const ext_subjectAltNames = ['otherName', 'rfc822Name', 'dNSName', 'x400Address', 'directoryName', 'ediPartyName', 'uniformResourceIdentifier', 'iPAddress', 'registeredID'];

const parseExtension = (oid, ext) => {
  switch (oid.oid) {
    case '2.5.29.15': { // key_usage
      let bitmap = ext.value[0];
      const usage = [];
      for (let i = 0; i < 8; i++) {
        if (bitmap & (1 << (7-i))) usage.push(ext_keyUsages[i]);
      }
      return usage;
    }
    case '2.5.29.37': // ext_key_usage
      return ext.children.map(oid => oid.value);
    case '2.5.29.17': // subject_alt_name
      return ext.children.map(gname => {
        return {
          type: ext_subjectAltNames[gname.type],
          value: toASCII(gname.value),
        };
      });
    case '1.3.6.1.5.5.7.1.3': // qcStatements
      return ext.children.map(qcs => {
        return {
          key: qcs.children[0].value,
          value: qcs.children[1] ? qcs.children[1].value : undefined
        };
      });
    default:
      return ext;
  }
};

function parseCertificate(pem) {
  const info = parsePem(pem);
  const tbsCert = info.children[0];

  let idx = -1;
  const version = tbsCert.children[0].tagClass === 2/*context*/ && tbsCert.children[0].type === 0 /*version*/
    ?  tbsCert.children[++idx].children[0]
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
  for (let i = 7; i < tbsCert.children.length; i++) {
    if (tbsCert.children[i].tagClass !== 2) return; // not context-specific
    switch (tbsCert.children[i].type) {
      case 1:
        issuerUniqueID = tbsCert.children[i];
        break;
      case 2:
        subjectUniqueID = tbsCert.children[i];
        break;
      case 3:
        extensions = tbsCert.children[i];
        break;
    }
  }

  return {
    version: version.value,
    serialNumber: toHex(serialNumber.raw),
    signature: {
      algorithm: signature.children[0].value,
      parameters: signature.children[1].value,
    },
    issuer: toDictionary(issuer.children),
    validity: {
      notBefore: validity.children[0].value,
      notAfter: validity.children[1].value,
    },
    subject: toDictionary(subject.children),
    subjectPublicKeyInfo: {
      algorithm: subjectPublicKeyInfo.children[0].children[0].value,
      publicKey: subjectPublicKeyInfo.children[0].children[0].value === 'rsaEncryption'
        ? (() => {
          const keyAsn = parse(subjectPublicKeyInfo.children[1].value);
          return {
            publicKey: keyAsn.children[0].value,
            modulus: keyAsn.children[0].raw,
            exponent: keyAsn.children[1].value,
          };
        })()
        : subjectPublicKeyInfo.children[1].value // TODO: extract curve name for EC
    },
    issuerUniqueID: issuerUniqueID ? issuerUniqueID.children[0].value : undefined,
    subjectUniqueID: subjectUniqueID ? subjectUniqueID.children[0].value : undefined,
    extensions: extensions ? extensions.children[0].children
      .reduce((a, c) => {
        a[c.children[0].value] = parseExtension(c.children[0], parse(c.children[1].value));
        return a;
      }, {}): undefined,
  }
}

export { parseCertificate };