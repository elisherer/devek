import actions from 'actions';
import initialState from "../../initialState";

import { reduceNumberBy, reduceTextBy } from './base';

actions.base = {

  from: e => state => reduceNumberBy('from', { ...state, from: e.target.value }),
  fromBase: e => state => reduceNumberBy('from', { ...state, fromBase: parseInt(e.target.value) }),
  to: e => state => reduceNumberBy('to', { ...state, to: e.target.value }),
  toBase: e => state => reduceNumberBy('to', { ...state, toBase: parseInt(e.target.value) }),

  utf8: e => state => reduceTextBy('utf8', { ...state, utf8: e.target.value }),
  binary: e => state => reduceTextBy('binary', { ...state, binary: e.target.value }),
  hex: e => state => reduceTextBy('hex', { ...state, hex: e.target.value }),
  base64: e => state => reduceTextBy('base64', { ...state, base64: e.target.value }),
};

initialState.base = {
  fromBase: 16,
  toBase: 10,
  errors: {}
};