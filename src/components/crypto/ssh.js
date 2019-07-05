// Credit for this goes to: https://git.coolaj86.com/coolaj86/bluecrypt-jwk-to-ssh.js
import devek from 'devek';
const crypto = devek.crypto;

const int32ToArrayBE = x => new Uint8Array([x>>24,x>>16, x>>8, x]); // network byte order

const bigNum2 = b64u => {
  const v = devek.base64UrlToUint8Array(b64u);
  if ((v[0] & 0x80) !== 0x80) return v;
  const w = new Uint8Array(v.length + 1);
  w.set(v, 1);
  return w;
};

const padStartEC = (v, len) => {
  if (v.length >= len) return v;
  const w = new Uint8Array(len);
  w.set(v, len - v.length);
  return w;
};

const padCount = v => {
  if (v.length % 8 === 0) return v;
  const w = new Uint8Array(v.length + 8 - (v.length % 8));
  w.set(v);
  for (let i = v.length; i < w.length; i++)
    w[i] = i + 1 - v.length;
  return w;
};

const build = (...args) => devek.concatUint8Array.apply(null, args.reduce((a,c) => {
  if (typeof c === 'number') {
    a.push(int32ToArrayBE(c));
    return a;
  }
  a.push(int32ToArrayBE(c.length));
  c.length && a.push(typeof c === 'string' ? devek.stringToArray(c) : c);
  return a;
}, []));

const getComment = kty => {
  const now = new Date();
  return (kty === 'RSA' ? 'rsa' : 'ecdsa') + '-key-' + now.getFullYear() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDay().toString().padStart(2, '0');
};

function publicKeyJWKToSSH(jwk) {
  let type, array;
  switch (jwk.kty) {
    case 'RSA': { // RSASSA-PKCS1-v1_5
      type = "ssh-rsa";
      array = build(
        type,
        bigNum2(jwk.e),
        bigNum2(jwk.n)
      );
    }
    break;
    case 'EC': { // ECDSA (P-256 / P-384)
      const curveNumber = jwk.crv.substr(2),
        len = Math.ceil(parseInt(curveNumber) / 8);
      type = 'ecdsa-sha2-nistp' + curveNumber;
      array = build(
        type,
        'nistp' + curveNumber,
        devek.concatUint8Array([0x04],
          padStartEC(devek.base64UrlToUint8Array(jwk.x), len),
          padStartEC(devek.base64UrlToUint8Array(jwk.y), len)
        )
      );
    }
    break;
    default:
      throw new Error("Unsupported JWK type: " + jwk.type);
  }
  return {
    type,
    decoded: array,
    encoded: devek.arrayToBase64(array),
    comment: getComment(jwk.kty)
  };
}

function privateKeyJWKToSSHNew(sshpub, jwk) {

  const rnd = crypto.getRandomValues(new Uint8Array(4));

  let prv = null;
  switch (jwk.kty) {
    case 'RSA':
      prv = build(
        "ssh-rsa",
        bigNum2(jwk.n),
        bigNum2(jwk.e),
        bigNum2(jwk.d),
        bigNum2(jwk.p),
        bigNum2(jwk.q),
        bigNum2(jwk.qi),
        sshpub.comment
      );
      break;
    case 'EC':
      prv = devek.concatUint8Array(
        sshpub.decoded,
        build(
          bigNum2(jwk.d),
          sshpub.comment
        )
      );
      break;
  }

  const array = devek.concatUint8Array(
    devek.stringToArray('openssh-key-v1\0'),
    build(
      /*ciphername: */ 'none',
      /*kdfname: */ 'none',
      /*kdf: */ [],
      /*# of keys: */ 1,
      sshpub.decoded,
      padCount(devek.concatUint8Array(
        rnd, rnd,
        prv
      ))
    )
  );
  return devek.arrayToPEM(array, 'OPENSSH PRIVATE KEY');
}

export {
  publicKeyJWKToSSH,
  privateKeyJWKToSSHNew
};