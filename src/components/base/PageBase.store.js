import { reduceNumberBy, reduceTextBy } from './base';
import createStore from 'helpers/createStore';

const actionCreators = {
  from: e => state => reduceNumberBy('from', { ...state, from: e.target.value }),
  fromBase: e => state => reduceNumberBy('from', { ...state, fromBase: parseInt(e.target.value) }),
  to: e => state => reduceNumberBy('to', { ...state, to: e.target.value }),
  toBase: e => state => reduceNumberBy('to', { ...state, toBase: parseInt(e.target.value) }),

  utf8: e => state => reduceTextBy('utf8', { ...state, utf8: e.target.value }),
  binary: e => state => reduceTextBy('binary', { ...state, binary: e.target.value }),
  hex: e => state => reduceTextBy('hex', { ...state, hex: e.target.value }),
  base64: e => state => reduceTextBy('base64', { ...state, base64: e.target.value }),
  base64Url: e => state => reduceTextBy('base64Url', { ...state, base64Url: e.target.value }),
};

const initialState = {
  from: '',
  fromBase: 16,
  to: '',
  toBase: 10,
  utf8: '',
  binary: '',
  hex: '',
  base64: '',
  base64Url: '',
  errors: {}
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'base');