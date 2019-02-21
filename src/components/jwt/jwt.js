const cryptoAPI = window.crypto || window.msCrypto;

const hmacSha256 = (str, base64Key) => cryptoAPI.subtle.importKey(
"jwk",
{
  kty: "oct",
  alg: "HS256",
  k: base64Key,
  ext: true,
  key_ops: ["sign"],
},
{
  name: "HMAC",
  hash: "SHA-256"
},
true,
["sign"]).then(key => {
  const buf = new TextEncoder("utf-8").encode(str);
  return cryptoAPI.subtle.sign("HMAC", key, buf);
});

const emptyB64 = btoa('');

const base64UrlEncodeWeb = value => {
  if (!value) return emptyB64;
  return btoa(value).replace(/=+/g, "").replace(/\+/g, '-').replace(/\//g, '_');
};

const arrayToBase64Url = a => base64UrlEncodeWeb(String.fromCharCode(...new Uint8Array(a)));


const base64UrlDecode = b64uval => {
  if (!b64uval.length) return b64uval;
  try {
    const b64val = b64uval.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64val));
  }
  catch (e)
  {
    console.error(e); // eslint-disable-line
    return 'Error';
  }
};

const sign = async (alg, token, secret) => {
  try {
    if (secret && secret.length > 1) {
      switch (alg) {
        case 'HS256': {
          const array = await hmacSha256(token, secret);
          return arrayToBase64Url(array);
        }
      }
    }
    return '';
  }
  catch (e) {
    console.error(e); // eslint-disable-line
    return '';
  }
};

const encodeAsync = async (alg, payload, key) => {
  const header = {
    type: 'JWT'
  };
  if (alg && alg !== 'none') {
    header.alg = alg;
  }

  try {
    const encodedHeader = base64UrlEncodeWeb(JSON.stringify(header)),
      encodedPayload = base64UrlEncodeWeb(JSON.stringify(JSON.parse(payload)));

    const prefix = encodedHeader + '.' + encodedPayload;
    const sig = await sign(alg, prefix, key);

    return {out_token: prefix + '.' + sig, sig};
  }
  catch (e) {
    return { out_token: e.message};
  }
};


const decodeAsync = async (token, secret) => {
  try {
    const parts = token.split('.'), result = { alg: '', header: '', payload: '', sig: '', valid: false };
    if (parts.length > 0) {
      const header = base64UrlDecode(parts[0]);
      result.header = JSON.stringify(header, null, 2);

      if (parts.length > 1) {
        result.payload = JSON.stringify(base64UrlDecode(parts[1]), null, 2);
        result.sig = parts.length > 2 ? parts[2] : '';
        let sig = 'No alg!';
        if (header.alg && header.alg.toLowerCase() !== "none") {
          result.alg = header.alg;
          sig = await sign(header.alg, `${parts[0]}.${parts[1]}`, secret);
        }
        result.valid = result.sig === sig;
      }
    }
    return result;
  }
  catch (e) {
    console.error(e); // eslint-disable-line
    return [];
  }
};

export {
  encodeAsync,
  decodeAsync
};