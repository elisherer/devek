function stringToArray(s) {
  return s.split("").map(c => c.charCodeAt());
}

function arrayToPem(a) {
  return window.btoa(a.map(c => String.fromCharCode(c)).join(""));
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


function integerToOctet(n) {
  const result = [];
  for (let i = n; i > 0; i >>= 8) {
    result.push(i & 0xff);
  }
  return result.reverse();
}

function lenToArray(n) {
  const oct = integerToOctet(n);
  let i;
  for (i = oct.length; i < 4; i += 1) {
    oct.unshift(0);
  }
  return oct;
}

function checkHighestBit(v) {
  if (v[0] >> 7 === 1) {
    // add leading zero if first bit is set
    v.unshift(0);
  }
  return v;
}

function jwkToInternal(jwk) {
  return {
    type: "ssh-rsa",
    exponent: checkHighestBit(stringToArray(base64UrlDecode(jwk.e))),
    key: checkHighestBit(stringToArray(base64UrlDecode(jwk.n))),
  };
}

function jwkToSSH(jwk, comment) {
  const k = jwkToInternal(jwk);
  const keyLenA = lenToArray(k.key.length);
  const exponentLenA = lenToArray(k.exponent.length);
  const typeLenA = lenToArray(k.type.length);
  const array = [].concat(typeLenA, stringToArray(k.type), exponentLenA, k.exponent, keyLenA, k.key);
  const encoding = arrayToPem(array);
  return `${k.type} ${encoding} ${comment}`;
}


export default jwkToSSH;