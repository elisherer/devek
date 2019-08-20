import devek from 'devek';

const crypto = devek.crypto;

const similarLetters=/[1lIioO0]/g;

const generateTable = flags => {
  let table = '';
  if (flags.includes('A')) {
    table += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (flags.includes('a')) {
    table += "abcdefghijklmnopqrstuvwxyz";
  }
  if (flags.includes('0')) {
    table += "0123456789";
  }
  if (flags.includes('!')) {
    table += "!@#$%^&*=";
  }
  if (flags.includes('O')) {
    table = table.replace(similarLetters,'');
  }
  return table;
};

let get16Bytes;

if (crypto.getRandomValues) {
  let rnds = new Uint8Array(16);
  get16Bytes = () => {
    crypto.getRandomValues(rnds);
    return rnds;
  }
} else {
  let rnds = new Array(16);
  get16Bytes = () => {
    for (let i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }
    return rnds;
  }
}

const b2h = [];
for (let i = 0; i < 256; ++i) {
  b2h[i] = (i + 0x100).toString(16).substr(1);
}

const uuidv4 = () => {
  let i = 0;
  const buf = get16Bytes();
  buf[6] = (buf[6] & 0x0f) | 0x40;
  buf[8] = (buf[8] & 0x3f) | 0x80;
  return ([b2h[buf[i++]], b2h[buf[i++]],
    b2h[buf[i++]], b2h[buf[i++]], '-',
    b2h[buf[i++]], b2h[buf[i++]], '-',
    b2h[buf[i++]], b2h[buf[i++]], '-',
    b2h[buf[i++]], b2h[buf[i++]], '-',
    b2h[buf[i++]], b2h[buf[i++]],
    b2h[buf[i++]], b2h[buf[i++]],
    b2h[buf[i++]], b2h[buf[i]]]).join('');
};

const generatePassword = (size, table) => {
  if (typeof crypto.getRandomValues === "function") {
    const u8array = new Uint8Array(size);
    crypto.getRandomValues(u8array);
    const array = Array.prototype.slice.call(u8array);
    return array.map(rnd => table[Math.floor(table.length * rnd/256)]).join('');
  }
  else
    return "Crypto not supported";
};

export {
  generateTable,
  generatePassword,
  uuidv4
};