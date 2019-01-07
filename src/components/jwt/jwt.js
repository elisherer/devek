const emptyB64 = btoa('');

const stringifyToBase64Url = value => {
  if (!value) return emptyB64;
  return btoa(JSON.stringify(JSON.parse(value))).replace(/=/g, "").replace(/\+/g, '-').replace(/\//g, '_');
};

const parseFromBase64UrlToString = b64uval => {
  if (!b64uval.length) return b64uval;
  //try {
    const b64val = b64uval.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.stringify(JSON.parse(atob(b64val)), null, 2)
      .replace(/\n/gm,'<br/>')
      .replace(/ /gm,'&nbsp;');
  /*}
  catch (e)
  {
    return 'Error';
  }*/
};

const encode = (header, payload, sig) => {
  return stringifyToBase64Url(header) + '.' + stringifyToBase64Url(payload) + '.' + sig;
};

const decode = token => {
  const parts = token.split('.'), result = [];
  if (parts.length > 0) {
    result.push(parseFromBase64UrlToString(parts[0]));
  }
  if (parts.length > 1) {
    result.push(parseFromBase64UrlToString(parts[1]));
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