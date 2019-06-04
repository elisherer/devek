const u8 = 0xFF;
const len32 = x => [(x>>24) & u8,(x>>16) & u8, (x>>8) & u8, x & u8];
const stringToArray = s => [...s].map(c => c.charCodeAt());
const base64UrlDecode = b64u => atob(b64u.replace(/-/g, '+').replace(/_/g, '/'));
const arrayToString = a => String.fromCharCode.apply(null, a);
const arrayToBase64 = a => btoa(arrayToString(a));
const arrayToBase64Url = a => arrayToBase64(a).replace(/=+/g, "").replace(/\+/g, '-').replace(/\//g, '_');
const pemToArray = pem => stringToArray(atob(pem));
const arrayToLen = a => a.reduce((a, c) => a * 256 + c);

const checkHighestBit = v => {
  if (v[0] >> 7 === 1) v.unshift(0);
  return v;
};

function jwkToSSH(jwk) {
  const type = "ssh-rsa",
    exponent = checkHighestBit(stringToArray(base64UrlDecode(jwk.e))),
    key = checkHighestBit(stringToArray(base64UrlDecode(jwk.n)));
  const array = [].concat(
    len32(type.length), stringToArray(type),
    len32(exponent.length), exponent,
    len32(key.length), key);
  return  type + ' ' + arrayToBase64(array);
}

function sshToJwk(s) {
  const split = s.split(" ");
  const prefix = split[0];
  if (prefix !== "ssh-rsa") {
    throw new Error(`Unknown prefix: ${prefix}`);
  }
  const buffer = pemToArray(split[1]);
  const type = arrayToString(buffer.splice(0, arrayToLen(buffer.splice(0, 4))));
  if (type !== "ssh-rsa") {
    throw new Error(`Unknown key type: ${type}`);
  }
  const exponent = arrayToBase64Url(buffer.splice(0, arrayToLen(buffer.splice(0, 4))));
  const keyLen = arrayToLen(buffer.splice(0, 4));
  const key = arrayToBase64Url(buffer.splice(buffer[0] ? 0 : 1, keyLen - (buffer[0] ? 0 : 1)));
  return { e: exponent, n: key, kty: "RSA", key_ops: ["encrypt"], ext: true, alg: "RS256" };
}

export {
  jwkToSSH,
  sshToJwk,
};