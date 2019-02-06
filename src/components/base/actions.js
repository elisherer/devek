import actions from 'actions';
import initialState from "../../initialState";

const radixStr = "0123456789abcdefghijklmnopqrstuvwxyz";
const radixRegex = Array.from({ length: 36 - 2 },
  (_, i) => new RegExp("^[-+]?([" + radixStr.substr(0, 2+i) + "]+|Infinity)$"));
const parseIntStrict = (value, radix) => {
  if (radix >= 2 && radix <= 36 && radixRegex[radix-2].test(value))
    return parseInt(value, radix);
  return NaN;
};

actions.base = {
  from: e => state => {
    let fromNumber = state.fromNumber;
    if (fromNumber.length && !state.fromError) {
      fromNumber = parseIntStrict(fromNumber, state.from).toString(e.target.value);
    }
    return {
      ...state,
      from: parseInt(e.target.value),
      fromNumber,
    };
  },
  to: e => state => {
    let toNumber = state.toNumber;
    if (toNumber.length && !state.toError) {
      toNumber = parseIntStrict(toNumber, state.to).toString(e.target.value);
    }
    return {
      ...state,
      to: parseInt(e.target.value),
      toNumber,
    };
  },
  fromNumber: e => state => {
    let toNumber = state.toNumber,
     fromError = true;
    const newFromNumber = parseIntStrict(e.target.value, state.from);
    if (!isNaN(newFromNumber)) { // if the new to is valid, then calc the new from
      toNumber = newFromNumber.toString(state.to);
      fromError = false;
    }
    return {
      ...state,
      fromNumber: e.target.value,
      fromError,
      toNumber,
    };
  },
  toNumber: e => state => {
    let fromNumber = state.fromNumber,
     toError = true;
    const newToNumber = parseIntStrict(e.target.value, state.to);
    if (!isNaN(newToNumber)) { // if the new to is valid, then calc the new from
      fromNumber = newToNumber.toString(state.from);
      toError = false;
    }
    return {
      ...state,
      toNumber: e.target.value,
      toError,
      fromNumber,
    };
  },
};

initialState.base = {
  from: 16,
  to: 10,
};

export const getFrom = state => state.base && typeof state.base.from === 'number' ? state.base.from : 0;
export const getTo = state => state.base && typeof state.base.to === 'number' ? state.base.to : 0;
export const getFromNumber = state => state.base && typeof state.base.fromNumber === 'string' ? state.base.fromNumber : '';
export const getToNumber = state => state.base && typeof state.base.toNumber === 'string' ? state.base.toNumber : '';
export const getFromError = state => state.base && state.base.fromError;
export const getToError = state => state.base && state.base.toError;