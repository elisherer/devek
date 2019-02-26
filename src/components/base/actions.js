import actions from 'actions';
import initialState from "../../initialState";

const radixStr = "0123456789abcdefghijklmnopqrstuvwxyz";
const radixRegex = Array.from({ length: 36 - 2 + 1 },
  (_, i) => new RegExp("^[-+]?([" + radixStr.substr(0, 2+i) + "]+|Infinity)$"));
const parseIntStrict = (value, radix) => {
  if (radix >= 2 && radix <= 36 && radixRegex[radix-2].test(value))
    return parseInt(value, radix);
  return NaN;
};

const parseBinaryText = value => {

};

const utf8ToBinary = utf8 => utf8.split('').map(char => ('0000000' + char.charCodeAt(0).toString(2)).slice(-8)).join(' ');


const reduceNumberBy = (field, fields /*fromNumber, toNumber, fromBase, toBase*/) => {
  // save current field
  const newState = { ...fields, errors: { ...fields.errors }};
  newState[field + 'Number'] = fields[field + 'Number'];
  newState[field + 'Base'] = fields[field + 'Base'];

  // calc new field (and determine if is valid)
  const parsedValue = parseIntStrict(fields[field + 'Number'], fields[field + 'Base']);
  const invalid = isNaN(parsedValue);

  // if the new value is valid, then calc the others fields new values
  const otherField = field === "to" ? "from" : "to";
  if (!invalid) {
    newState[otherField + 'Number'] = parsedValue.toString(fields[otherField + 'Base']);
  }

  newState.errors[field + 'Number'] = invalid;
  newState.errors[otherField + 'Number'] = newState.errors[otherField + 'Number'] && invalid;

  return newState;
};

actions.base = {
  fromBase: e => state => reduceNumberBy('from', { ...state, fromBase: parseInt(e.target.value) }),
  toBase: e => state => reduceNumberBy('to', { ...state, toBase: parseInt(e.target.value) }),
  fromNumber: e => state => reduceNumberBy('from', { ...state, fromNumber: e.target.value }),
  toNumber: e => state => reduceNumberBy('to', { ...state, toNumber: e.target.value }),

  utf8: e => state => {
    return {
      ...state,
      utf8: e.target.value,
      binary: e.target.value.split('').map(char => char.charAt(0).toString(2)).join(' ')
    }
  },
  binary: e => state => {

  }
};

initialState.base = {
  fromBase: 16,
  toBase: 10,
  errors: {}
};