import webcolors from './webcolors';
import { reduceBy } from "./color";
import createStore from "../../helpers/createStore";

const actionCreators = {
  rgba: e => state => reduceBy('rgba', { ...state, rgba: e.target.value }),
  hex: e => state => reduceBy('hex', { ...state, hex: e.target.value }),
  hsla: e => state => reduceBy('hsla', { ...state, hsla: e.target.value }),
  hwba: e => state => reduceBy('hwba', { ...state, hwba: e.target.value }),
  cmyka: e => state => reduceBy('cmyka', { ...state, cmyka: e.target.value }),
  webcolor: e => state => reduceBy('hex', { ...state, hex: webcolors[e.target.value] }),
};

const initialState = {
  rgba: 'rgba(85, 0, 170, 0.75)',
  hex: '#50a',
  hsla: 'hsla(270, 100%, 33.33%, 0.75)',
  hwba: 'hwba(270, 0%, 33.33%, 0.75)',
  cmyka: 'cmyka(50%, 100%, 0%, 33.33%, 0.75)',
  parsed: { r: 85, g: 0, b: 170, a: 0.75 },
  errors: {},
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'color');