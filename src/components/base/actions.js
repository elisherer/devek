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

const reduceByFrom = (fromNumber, fromBase, state) => {
  let toNumber = state.toNumber,
    invalid = true;
  const newFromNumber = parseIntStrict(fromNumber, fromBase);
  if (!isNaN(newFromNumber)) { // if the new to is valid, then calc the new from
    toNumber = newFromNumber.toString(state.toBase);
    invalid = false;
  }
  return {
    ...state,
    fromNumber,
    fromBase,
    toNumber,
    errors: {
      ...state.errors,
      fromNumber: invalid,
      toNumber: invalid && state.errors.toNumber
    }
  }
};

const reduceByTo = (toNumber, toBase, state) => {
  let fromNumber = state.fromNumber,
    invalid = true;
  const newToNumber = parseIntStrict(toNumber, toBase);
  if (!isNaN(newToNumber)) { // if the new to is valid, then calc the new from
    fromNumber = newToNumber.toString(state.fromBase);
    invalid = false;
  }
  return {
    ...state,
    toNumber,
    toBase,
    fromNumber,
    errors: {
      ...state.errors,
      toNumber: invalid,
      fromNumber: invalid && state.errors.fromNumber
    }
  }
};

actions.base = {
  fromBase: e => state => reduceByFrom(state.fromNumber, parseInt(e.target.value), state),
  toBase: e => state => reduceByTo(state.toNumber, parseInt(e.target.value), state),
  fromNumber: e => state => reduceByFrom(e.target.value, state.fromBase, state),
  toNumber: e => state => reduceByTo(e.target.value, state.toBase, state),
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

export const getErrors = state => state.base && state.base.errors;

export const getFromBase = state => state.base && typeof state.base.fromBase === 'number' ? state.base.fromBase : 0;
export const getToBase = state => state.base && typeof state.base.toBase === 'number' ? state.base.toBase : 0;
export const getFromNumber = state => state.base && typeof state.base.fromNumber === 'string' ? state.base.fromNumber : '';
export const getToNumber = state => state.base && typeof state.base.toNumber === 'string' ? state.base.toNumber : '';

export const getUTF8 = state => state.base && typeof state.base.utf8 === 'number' ? state.base.from : 0;
