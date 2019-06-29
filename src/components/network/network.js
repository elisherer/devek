const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
const 
  zeros = '00000000', 
  ones = '11111111', 
  onesAndZeros = ones + ones + ones + ones + zeros + zeros + zeros + zeros + ones + ones + ones + ones;

export const subnetToMask = subnet => onesAndZeros.substr(32 - subnet, 32);

const getIPClass = ip => {
  if (ip < 0) {
    ip = ip >>> 0; // convert to unsigned
  }
  if (ip >= 0x01000001 && ip <= 0x7efffffe) return 'A';
  if (ip >= 0x80010001 && ip <= 0xbffffffe) return 'B';
  if (ip >= 0xc0000101 && ip <= 0xdffffefe) return 'C';
  if (ip >= 0xe0000000 && ip <= 0xefffffff) return 'D';
  if (ip >= 0xf0000000 && ip <= 0xfefffffe) return 'E';
  return '';
};

export const isPrivate = ip => 
  (ip >= 0x0a000000 && ip <= 0x0affffff) ||
  (ip >= 0xac100000 && ip <= 0xac1fffff) ||
  (ip >= 0xc0a80000 && ip <= 0xc0a8ffff);

const parsers = {
  ipv4: str => {
    const match = str.match(ipv4Regex);
    if (!match) return null;
    let a = Number(match[1]), b = Number(match[2]), c = Number(match[3]), d = Number(match[4]);
    if (a > 255 || b > 255 || c > 255 || d > 255) return null;
    return a * 0x1000000 + b * 0x10000 + c * 0x100 + d;
  },
};

export const formatters = {
  ipv4: ip => ip.toString(2).padStart(32, '0').replace(/[01]{8}/g, num => parseInt(num, 2) + '.').slice(0,-1),
  ipv4_binary: ip => ip.toString(2).padStart(32, '0').replace(/[01]{8}/g,'$&.').slice(0,-1),
  class: getIPClass,
};

const allFields = ['ipv4'];


export const reduceBy = (field, fields) => {
  const newState = { ...fields, errors: { ...fields.errors }};

  // calc new field (and determine if is valid)
  const parsedValue = parsers[field](fields[field]);
  const invalid = parsedValue === null;

  // if the new value is valid, then calc the others fields new values
  const otherFields = allFields.filter(x => x !== field);
  if (!invalid) {
    newState.parsed = parsedValue;
    otherFields.forEach(otherField => {
      newState[otherField] = formatters[otherField](parsedValue);
      newState.errors[otherField] = false;
    });
  }

  newState.errors[field] = invalid;

  return newState;
};