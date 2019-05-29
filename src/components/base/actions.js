import { reduceNumberBy, reduceTextBy } from './base';

const actions = {

  from: (state, { payload }) => reduceNumberBy('from', { ...state, from: payload }),
  fromBase: (state, { payload }) => reduceNumberBy('from', { ...state, fromBase: parseInt(payload) }),
  to: (state, { payload }) => reduceNumberBy('to', { ...state, to: payload }),
  toBase: (state, { payload }) => reduceNumberBy('to', { ...state, toBase: parseInt(payload) }),

  utf8: (state, { payload }) => reduceTextBy('utf8', { ...state, utf8: payload }),
  binary: (state, { payload }) => reduceTextBy('binary', { ...state, binary: payload }),
  hex: (state, { payload }) => reduceTextBy('hex', { ...state, hex: payload }),
  base64: (state, { payload }) => reduceTextBy('base64', { ...state, base64: payload }),
};

export const reducer = (state, action) => {
  const reduce = actions[action.type];
  return reduce ? reduce(state, action) : state;
};

export const initialState = {
  fromBase: 16,
  toBase: 10,
  errors: {}
};