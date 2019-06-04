function stringToArray(s) {
  return s.split("").map(c => c.charCodeAt());
}

const base64UrlDecode = b64uval => {
  try {
    if (!b64uval || !b64uval.length) return b64uval;
    const b64val = b64uval.replace(/-/g, '+').replace(/_/g, '/');
    return atob(b64val);
  }
  catch(e) {
    return {
      error: 'Bad Base64Url value'
    };
  }
};

function lenToArray(n) {
  const oct = [];
  for (let i = n; i > 0; i >>= 8) {
    oct.unshift(i & 0xff);
  }
  for (let i = oct.length; i < 4; i++) {
    oct.unshift(0);
  }
  return oct;
}

function checkHighestBit(v) {
  if (v[0] >> 7 === 1) v.unshift(0);
  return v;
}

function jwkToInternal(jwk) {
  return {
    type: "ssh-rsa",
    exponent: checkHighestBit(stringToArray(base64UrlDecode(jwk.e))),
    key: checkHighestBit(stringToArray(base64UrlDecode(jwk.n))),
  };
}

function arrayToBase64(a) {
  return btoa(a.map(c => String.fromCharCode(c)).join(""));
}

function jwkToSSH(jwk) {
  const k = jwkToInternal(jwk);
  const array = [].concat(
    lenToArray(k.key.length), stringToArray(k.type),
    lenToArray(k.exponent.length), k.exponent,
    lenToArray(k.type.length), k.key);
  return k.type + ' ' + arrayToBase64(array);
}

export default jwkToSSH;