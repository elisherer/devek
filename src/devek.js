const devek = {};

devek.crypto = window.crypto || window.msCrypto;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

devek.concatUint8Array = (...args) => {
  const o = new Uint8Array(args.reduce((a,c) => a + (c.length || c.byteLength), 0));
  let offset = 0;
  args.forEach(c => {
    o.set(c, offset);
    offset += c.length || c.byteLength;
  });
  return o;
};

const emptyB64 = btoa(''),
  whiteSpaceRegex = /\s+/g;

const toB64Url = b64 => b64
  .replace(/=+/g, "")
  .replace(/\+/g, '-')
  .replace(/\//g, '_');
const fromB64Url = b64u => b64u
  .replace(/-/g, '+')
  .replace(/_/g, '/');

devek.stringToBase64 = value => !value ? emptyB64 : btoa(String.fromCharCode.apply(null, encoder.encode(value)));
devek.stringToBase64Url = value => !value ? emptyB64 : toB64Url(devek.stringToBase64(value));
devek.stringToArray = s => !s ? [] : [...s].map(c => c.codePointAt());
devek.stringToUint8Array = s => encoder.encode(s);

devek.base64ToUint8Array = base64 =>  {
  const bytesString = atob(base64);
  const length = bytesString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++)        {
    bytes[i] = bytesString.charCodeAt(i);
  }
  return bytes;
};
devek.base64UrlToUint8Array = b64u => devek.base64ToUint8Array(fromB64Url(b64u));

devek.hexStringToArray = s => {
  const bytes = s.replace(whiteSpaceRegex, '').match(/.{2}/g);
  return bytes ? bytes.map(x=>parseInt(x,16)) : [];
};
devek.binaryStringToArray = s => {
  const bytes = s.replace(whiteSpaceRegex, '').match(/.{8}/g);
  return bytes ? bytes.map(x=>parseInt(x,2)) : [];
};

devek.arrayToBase64 = value => !value ? emptyB64 : btoa(String.fromCharCode.apply(null, value));
devek.arrayToBase64Url = value => !value ? emptyB64 : toB64Url(btoa(String.fromCharCode.apply(null, value)));
devek.arrayToHexString = a => (Array.isArray(a) ? a : [...a]).map(x => x.toString(16).padStart(2, '0')).join('');
devek.arrayToAscii = a => decoder.decode(Array.isArray(a) ? new Uint8Array(a).buffer : a);
const charCache = new Array(128);
devek.arrayToString = array => {
  if (!array) return '';
  const result = [];
  const charFromCodePt = String.fromCodePoint || String.fromCharCode;
  let codePt, byte1;
  const buffLen = array.length || array.byteLength;

  for (let i = 0; i < buffLen;) {
    byte1 = array[i++];
    if (byte1 <= 0x7F) {
      codePt = byte1;
    } else if (byte1 <= 0xDF) {
      codePt = ((byte1 & 0x1F) << 6) | (array[i++] & 0x3F);
    } else if (byte1 <= 0xEF) {
      codePt = ((byte1 & 0x0F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
    } else if (String.fromCodePoint) { // Does not work on IE-11
      codePt = ((byte1 & 0x07) << 18) | ((array[i++] & 0x3F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
    } else {
      codePt = 63; // '?'
      i += 3;
    }
    result.push(charCache[codePt] || (charCache[codePt] = charFromCodePt(codePt)));
  }
  return result.join('');
};

window.devek = devek;

export default devek;