const devek = {};

devek.crypto = window.crypto || window.msCrypto;

const encoder = new TextEncoder();

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

devek.base64UrlEncode = value => {
  if (!value) return emptyB64;
  return btoa(value).replace(/=+/g, "").replace(/\+/g, '-').replace(/\//g, '_');
};
devek.base64ToUint8Array = base64 =>  {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array( len );
  for (let i = 0; i < len; i++)        {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
};
devek.base64UrlDecodeToUint8Array = b64u => devek.base64ToUint8Array(b64u.replace(/-/g, '+').replace(/_/g, '/'));

devek.stringToArray = s => [...s].map(c => c.charCodeAt());
devek.stringToUint8Array = s => encoder.encode(s);

devek.hexStringToArray = s => s.replace(whiteSpaceRegex, '').match(/.{2}/g).map(x=>parseInt(x,16));


devek.arrayToString = a => String.fromCharCode.apply(null, a);
devek.arrayToHexString = a => (Array.isArray(a) ? a : [...a]).map(x => x.toString(16).padStart(2, '0')).join('');

devek.arrayToBase64 = a => btoa(devek.arrayToString(a));

devek.arrayToBase64Url = a => devek.base64UrlEncode(devek.arrayToString(a));

window.devek = devek;

export default devek;