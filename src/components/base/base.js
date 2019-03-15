import zPad from 'helpers/zPad';

const radixStr = "0123456789abcdefghijklmnopqrstuvwxyz";
const radixRegex = Array.from({ length: 36 - 2 + 1 },
  (_, i) => new RegExp("^[-+]?([" + radixStr.substr(0, 2+i) + "]+|Infinity)$"));
const parseIntStrict = (value, radix) => {
  if (radix >= 2 && radix <= 36 && radixRegex[radix-2].test(value))
    return parseInt(value, radix);
  return NaN;
};

export const reduceNumberBy = (field, fields) => {
  const newState = { ...fields, errors: { ...fields.errors }};

  // calc new field (and determine if is valid)
  const parsedValue = parseIntStrict(fields[field], fields[field + 'Base']);
  const invalid = isNaN(parsedValue);

  // if the new value is valid, then calc the others fields new values
  const otherField = field === "to" ? "from" : "to";
  if (!invalid) {
    newState[otherField] = parsedValue.toString(fields[otherField + 'Base']);
    newState.errors[otherField] = false;
  }

  newState.errors[field] = invalid;

  return newState;
};

const id = x => x,
  binaryRegex = /^[01\s]+$/,
  hexRegex = /^[0-9a-f\s]+$/i,
  whiteSpaceRegex = /\s+/g;

const parsers = {
  utf8: id,
  binary: binary => binary && !binaryRegex.test(binary) ? NaN :
    binary.trim().replace(whiteSpaceRegex, ' ').split(' ')
      .map(b => String.fromCharCode(parseInt(b, 2))).join(''),
  hex: hex => hex && !hexRegex.test(hex) ? NaN :
    hex.trim().replace(whiteSpaceRegex, ' ').split(' ')
      .map(hx => String.fromCharCode(parseInt(hx, 16))).join(''),
};

const serializers = {
  utf8: id,
  binary: utf8 => utf8.split('').map(char => zPad(char.charCodeAt(0).toString(2), 8)).join(' '),
  hex: utf8 => utf8.split('').map(char => zPad(char.charCodeAt(0).toString(16), 2)).join(' '),
};

const allFields = Object.keys(parsers);

export const reduceTextBy = (field, fields) => {
  const newState = { ...fields, errors: { ...fields.errors }};

  // calc new field (and determine if is valid)
  const parsedValue = parsers[field](fields[field]);
  const invalid = typeof parsedValue !== 'string' && isNaN(parsedValue);

  // if the new value is valid, then calc the others fields new values
  const otherFields = allFields.filter(x => x !== field);
  if (!invalid) {
    otherFields.forEach(otherField => {
      newState[otherField] = serializers[otherField](parsedValue);
      newState.errors[otherField] = false;
    });
  }

  newState.errors[field] = invalid;

  return newState;
};
