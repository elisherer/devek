import devek from 'devek';

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

const binaryRegex = /^[01\s]+$/,
  hexRegex = /^\s*([0-9a-f]\s*[0-9a-f]\s*)*$/i;

const parsers = {
  utf8: devek.stringToUint8Array,
  binary: binary => binary && !binaryRegex.test(binary) ? NaN :
    devek.binaryStringToArray(binary),
  hex: hex => hex && !hexRegex.test(hex) ? NaN :
    devek.hexStringToArray(hex),
  base64: b64 => {
    try {
      return devek.base64ToUint8Array(b64);
    }
    catch (e) {
      return NaN;
    }
  }
};

const serializers = {
  utf8: devek.arrayToString,
  binary: arr => [...arr].map(x => x.toString(2).padStart(8, '0')).join(' '),
  hex: devek.arrayToHexString,
  base64: devek.arrayToBase64,
};

const allFields = Object.keys(parsers);

export const reduceTextBy = (field, fields) => {
  const newState = { ...fields, errors: { ...fields.errors }};

  // calc new field (and determine if is valid)
  const parsedValue = parsers[field](fields[field]);
  const invalid = !parsedValue || (!parsedValue.buffer && !Array.isArray(parsedValue));

  // if the new value is valid, then calc the others fields new values
  const otherFields = allFields.filter(x => x !== field);
  if (!invalid) {
    newState.parsed = parsedValue;
    otherFields.forEach(otherField => {
      newState[otherField] = serializers[otherField](parsedValue);
      newState.errors[otherField] = false;
    });
  }

  newState.errors[field] = invalid;

  return newState;
};
