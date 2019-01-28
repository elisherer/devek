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

const generatePassword = (size, table) => {
  if (typeof crypto.getRandomValues === "function") {
    const u16array = new Uint16Array(size);
    crypto.getRandomValues(u16array);
    const array = Array.prototype.slice.call(u16array);
    return array.map(rnd => table[Math.floor(table.length * rnd/65536)]).join('');
  }
  else
    return "Crypto not supported";
};

export {
  generateTable,
  generatePassword
};