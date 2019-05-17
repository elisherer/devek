import actions from 'actions';
import initialState from 'initialState';
import webcolors from './webcolors';
import { reduceBy } from "./color";

actions.color = {
  rgba: e => state => reduceBy('rgba', { ...state, rgba: e.target.value }),
  hex: e => state => reduceBy('hex', { ...state, hex: e.target.value }),
  hsla: e => state => reduceBy('hsla', { ...state, hsla: e.target.value }),
  hwba: e => state => reduceBy('hwba', { ...state, hwba: e.target.value }),
  webcolor: e => state => reduceBy('hex', { ...state, hex: webcolors[e.target.value] }),
};

initialState.color = {
  rgba: 'rgba(85, 0, 170, 0.75)',
  hex: '#50a',
  hsla: 'hsla(270, 100%, 33.3%, 0.75)',
  hwba: 'hwb(208, 0%, 0%)',
  cmyka: 'cmyka(50%, 100%, 0%, 33.33%, 0.75)',
  parsed: { r: 85, g: 0, b: 170, a: 0.75 },
  errors: {},
};
