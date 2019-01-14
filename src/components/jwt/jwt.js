const emptyB64 = btoa('');

const stringifyToBase64Url = value => {
  if (!value) return emptyB64;
  return btoa(JSON.stringify(value)).replace(/=/g, "").replace(/\+/g, '-').replace(/\//g, '_');
};

const parseFromBase64UrlToHTML = b64uval => {
  if (!b64uval.length) return b64uval;
  try {
    const b64val = b64uval.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.stringify(JSON.parse(atob(b64val)), null, 2)
      .replace(/\n/gm,'<br/>')
      .replace(/ /gm,'&nbsp;');
  }
  catch (e)
  {
    return 'Error';
  }
};

const createSig = (prefix, alg ,key) => {
  return ''; //TODO: create signature for JWT
};

const encode = (payload, alg, key) => {
  const header = {
    type: 'JWT'
  };
  if (alg && alg !== 'none') {
    header.alg = alg;
  }

  const encodedHeader = stringifyToBase64Url(header),
    encodedPayload = stringifyToBase64Url(payload);

  const prefix = encodedHeader + '.' + encodedPayload;

  return prefix + '.' + createSig(prefix, alg, key);
};

const decode = token => {
  const parts = token.split('.'), result = [];
  if (parts.length > 0) {
    result.push(parseFromBase64UrlToHTML(parts[0]));
  }
  if (parts.length > 1) {
    result.push(parseFromBase64UrlToHTML(parts[1]));
  }
  if (parts.length > 2) {
    result.push(parts[2]);
  }
  return result;
};

export {
  encode,
  decode
};