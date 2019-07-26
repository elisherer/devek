import devek from 'devek';
const crypto = devek.crypto;

let lastKey, lastKeyBase64;

const createHMACSHA256Key = base64Key => {
  if (lastKeyBase64 === base64Key) {
    return Promise.resolve(lastKey);
  }
  lastKeyBase64 = base64Key;
  return crypto.subtle.importKey(
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
    ["sign"]);
};

const hmacSha256 = (str, base64Key) => createHMACSHA256Key(base64Key).then(key => {
  lastKey = key;
  const buf = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.sign("HMAC", key, buf);
});

const base64UrlDecode = b64uval => {
  try {
    if (!b64uval || !b64uval.length) return b64uval;
    return devek.arrayToUTF8(devek.base64UrlToUint8Array(b64uval));
  }
  catch(e) {
    return {
      error: 'Bad Base64Url value'
    };
  }
};

const sign = async (alg, token, secret) => {
  if (secret && secret.length > 1) {
    switch (alg) {
      case 'HS256': {
        const array = await hmacSha256(token, secret);
        return devek.arrayToBase64Url(array);
      }
    }
  }
  return '';
};

const encodeAsync = async (alg, payload, key) => {
  const header = {
    type: 'JWT'
  };
  if (alg && alg !== 'none') {
    header.alg = alg;
  }

  try {
    const encodedHeader = devek.stringToBase64Url(JSON.stringify(header)),
      encodedPayload = devek.stringToBase64Url(JSON.stringify(JSON.parse(payload)));

    const prefix = encodedHeader + '.' + encodedPayload;
    const sig = await sign(alg, prefix, key);

    return {out_token: prefix + '.' + sig, sig, error: false};
  }
  catch (e) {
    return { error: e.message};
  }
};

const parseAndPrettify = input => {
  if (typeof input !== 'string') return input; // something is wrong
  try {
    const obj = JSON.parse(input);
    return {
      pretty: JSON.stringify(obj, null, 2),
      obj
    };
  }
  catch (e) {
    return {
      pretty: input,
    };
  }
};

const decodeAsync = async (token, secret) => {
  const result = { alg: '', header: '', payload: '', sig: '', valid: false, error: false };
  try {
    const parts = token.split('.');
    if (parts.length > 0) {
      const parsedHeader = parseAndPrettify(base64UrlDecode(parts[0]));
      const header = parsedHeader.obj;
      result.header = parsedHeader.pretty;
      if (!parsedHeader.obj) {
        result.error = "Invalid header";
      }
      if (parts.length > 1) {
        const parsedPayload = parseAndPrettify(base64UrlDecode(parts[1]));
        result.payload = parsedPayload.pretty;
        if (parsedPayload.error) {
          result.error = parsedPayload.error;
        }
        result.sig = parts.length > 2 ? parts[2] : '';
        let sig = 'No alg!';
        if (header && header.alg && header.alg.toLowerCase() !== "none") {
          result.alg = header.alg;
          sig = await sign(header.alg, `${parts[0]}.${parts[1]}`, secret);
        }
        result.valid = result.sig === sig;
      }
    }
    return result;
  }
  catch (e) {
    result.error = e.message;
    return result;
  }
};

export {
  encodeAsync,
  decodeAsync
};