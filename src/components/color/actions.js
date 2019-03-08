import actions from 'actions';
import initialState from 'initialState';
import { reduceBy } from "./color";

actions.color = {
  rgba: e => state => reduceBy('rgba', { ...state, rgba: e.target.value }),
  hex: e => state => reduceBy('hex', { ...state, hex: e.target.value }),
};

initialState.color = {
  rgba: 'rgba(85, 0, 170, 0.75)',
  hex: '#50a',
  parsed: { r: 85, g: 0, b: 170, a: 0.75 },
  errors: {},
};
