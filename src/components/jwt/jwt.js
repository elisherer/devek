import encBase64 from 'crypto-js/enc-base64';
import encUtf8 from 'crypto-js/enc-utf8';
import hmacSHA256 from 'crypto-js/hmac-sha256';

const emptyB64 = btoa('');

const base64UrlEncode = wordArray => {
  if (!wordArray) return emptyB64;
  return encBase64.stringify(wordArray).replace(/=+/g, "").replace(/\+/g, '-').replace(/\//g, '_');
};

const base64UrlDecode = b64uval => {
  if (!b64uval.length) return b64uval;
  try {
    const b64val = b64uval.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64val));
  }
  catch (e)
  {
    return 'Error';
  }
};

const sign = (alg, token, secret) => {
  try {
    if (secret) {
      const parsedSecret = encBase64.parse(secret);
      switch (alg) {
        case 'HS256':
          return base64UrlEncode(hmacSHA256(token, parsedSecret));
      }
    }
    return '';
  }
  catch (e) {
    console.error(e); // eslint-disable-line
    return '';
  }
};

const encode = (payload, alg, key) => {
  const header = {
    type: 'JWT'
  };
  if (alg && alg !== 'none') {
    header.alg = alg;
  }

  const encodedHeader = base64UrlEncode(encUtf8.parse(JSON.stringify(header))),
    encodedPayload = base64UrlEncode(encUtf8.parse(JSON.stringify(payload)));

  const prefix = encodedHeader + '.' + encodedPayload;

  return prefix + '.' + sign(alg, prefix, key);
};


const decode = (token, secret) => {
  const parts = token.split('.'), result = [];
  if (parts.length > 0) {
    const header = base64UrlDecode(parts[0]);
    result.push(JSON.stringify(header, null, 2));

    if (parts.length > 1) {
      result.push(JSON.stringify(base64UrlDecode(parts[1]), null, 2));
      result.push(parts.length > 2 ? parts[2] : '');
      result.push(header.alg && header.alg.toLowerCase() !== "none" ? sign(header.alg, `${parts[0]}.${parts[1]}`, secret) : 'No alg!')
    }
  }
  return result;
};

export {
  encode,
  decode
};