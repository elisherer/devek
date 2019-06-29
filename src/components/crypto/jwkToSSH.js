import devek from 'devek';

const u8 = 0xFF;
const len32 = x => [(x>>24) & u8,(x>>16) & u8, (x>>8) & u8, x & u8];
const pemToArray = pem => devek.stringToArray(atob(pem));
const arrayToLen = a => a.reduce((a, c) => a * 256 + c);

const checkHighestBit = v => {
  if (v[0] >> 7 === 1) {
    const w = new Uint8Array(v.byteLength + 1);
    w.set(v, 1);
    return w;
  }
  return v;
};

function jwkToSSH(jwk) {
  const type = "ssh-rsa",
    exponent = checkHighestBit(devek.base64UrlToUint8Array(jwk.e)),
    key = checkHighestBit(devek.base64UrlToUint8Array(jwk.n));
  const array = devek.concatUint8Array(
    len32(type.length), devek.stringToArray(type),
    len32(exponent.length), [...exponent],
    len32(key.length), [...key]);
  return  type + ' ' + devek.arrayToBase64(array);
}

function sshToJwk(s) {
  const split = s.split(" ");
  const prefix = split[0];
  if (prefix !== "ssh-rsa") {
    throw new Error(`Unknown prefix: ${prefix}`);
  }
  const buffer = pemToArray(split[1]);
  const type = devek.arrayToString(buffer.splice(0, arrayToLen(buffer.splice(0, 4))));
  if (type !== "ssh-rsa") {
    throw new Error(`Unknown key type: ${type}`);
  }
  const exponent = devek.arrayToBase64Url(buffer.splice(0, arrayToLen(buffer.splice(0, 4))));
  const keyLen = arrayToLen(buffer.splice(0, 4));
  const key = devek.arrayToBase64Url(buffer.splice(buffer[0] ? 0 : 1, keyLen - (buffer[0] ? 0 : 1)));
  return { e: exponent, n: key, kty: "RSA", key_ops: ["encrypt"], ext: true, alg: "RS256" };
}

export {
  jwkToSSH,
  sshToJwk,
};