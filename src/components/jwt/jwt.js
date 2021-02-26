import devek from "devek";
const crypto = devek.crypto;

const hmacSha256 = (str, key) =>
  crypto.subtle
    .importKey(
      "raw",
      devek.stringToUint8Array(key),
      {
        name: "HMAC",
        hash: "SHA-256"
      },
      true,
      ["sign"]
    )
    .then(cryptoKey => crypto.subtle.sign("HMAC", cryptoKey, devek.stringToUint8Array(str)))
    .then(buffer => new Uint8Array(buffer));

const base64UrlDecode = b64uval => {
  try {
    if (!b64uval || !b64uval.length) return b64uval;
    return devek.arrayToUTF8(devek.base64UrlToUint8Array(b64uval));
  } catch (e) {
    return {
      error: "Bad Base64Url value"
    };
  }
};

const sign = (alg, token, secret) => {
  if (secret && secret.length > 1) {
    switch (alg) {
      case "HS256": {
        return hmacSha256(token, secret).then(devek.arrayToBase64Url);
      }
    }
  }
  return Promise.resolve("");
};

const encodeAsync = async (alg, payload, secret) => {
  const header = {};
  if (alg) {
    header.alg = alg;
  }
  header.typ = "JWT";
  try {
    const encodedHeader = devek.stringToBase64Url(JSON.stringify(header)),
      encodedPayload = devek.stringToBase64Url(JSON.stringify(JSON.parse(payload)));

    const prefix = encodedHeader + "." + encodedPayload;
    const sig = await sign(alg, prefix, secret);
    return {
      out_token: prefix + "." + sig,
      payload: JSON.stringify(JSON.parse(payload), null, 2),
      header: JSON.stringify(header, null, 2),
      sig,
      error: false
    };
  } catch (e) {
    return { error: e.message };
  }
};

const parseAndPrettify = input => {
  if (typeof input !== "string") return input; // something is wrong
  try {
    const obj = JSON.parse(input);
    return {
      pretty: JSON.stringify(obj, null, 2),
      obj
    };
  } catch (e) {
    return {
      pretty: input
    };
  }
};

const decodeAsync = async (token, secret) => {
  const result = {
    alg: "",
    header: "",
    payload: "",
    sig: "",
    valid: false,
    error: false
  };
  try {
    const parts = token.split(".");
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
        result.sig = parts.length > 2 ? parts[2] : "";
        let sig = "No alg!";
        if (header && header.alg && header.alg.toLowerCase() !== "none") {
          result.alg = header.alg;
          sig = await sign(header.alg, `${parts[0]}.${parts[1]}`, secret);
        }
        result.valid = result.sig === sig;
      }
    }
    return result;
  } catch (e) {
    result.error = e.message;
    return result;
  }
};

export { encodeAsync, decodeAsync };
