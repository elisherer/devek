// Credit for this goes to: https://github.com/PatrickRoumanoff/js-keygen
import devek from 'devek';

const u8 = 0xFF;
const len32 = x => [(x>>24) & u8,(x>>16) & u8, (x>>8) & u8, x & u8];

const checkHighestBit = v => {
  if (v[0] >> 7 === 1) {
    const w = new Uint8Array(v.byteLength + 1);
    w.set(v, 1);
    return w;
  }
  return v;
};

function publicKeyJWKToSSH(jwk) {
  const type = "ssh-rsa",
    exponent = checkHighestBit(devek.base64UrlToUint8Array(jwk.e)),
    key = checkHighestBit(devek.base64UrlToUint8Array(jwk.n));
  const array = devek.concatUint8Array(
    len32(type.length), devek.stringToArray(type),
    len32(exponent.length), [...exponent],
    len32(key.length), [...key]);
  return  type + ' ' + devek.arrayToBase64(array);
}

function asnEncodeLen(n) {
  let result = [];
  if (n >> 7) {
    for (let i = n; i > 0; i >>= 8) {
      result.unshift(i & 0xff);
    }
    result.unshift(0x80 + result.length);
  } else {
    result.push(n);
  }
  return result;
}

function privateKeyJWKToPKCS1(jwk) {
  const order = ["n", "e", "d", "p", "q", "dp", "dq", "qi"];
  const list = order.map(prop => {
    const v = checkHighestBit(devek.base64UrlToUint8Array(jwk[prop]));
    const len = asnEncodeLen(v.length);
    return devek.concatUint8Array([0x02],len, v); // int tag is 0x02
  });
  const seq = devek.concatUint8Array([0x02, 0x01, 0x00], ...list); // extra seq for SSH
  const len = asnEncodeLen(seq.length);
  const a = devek.concatUint8Array([0x30], len, seq); // seq is 0x30
  return devek.arrayToBase64(a);
}

export {
  publicKeyJWKToSSH,
  privateKeyJWKToPKCS1
};