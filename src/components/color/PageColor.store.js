import { reduceBy } from "./color";
import createStore from "../../helpers/createStore";

const actionCreators = {
  rgba: e => state => reduceBy('rgba', {...state, rgba: e.target.value}),
  hex: e => state => reduceBy('hex', {...state, hex: e.target.value}),
  hsla: e => state => reduceBy('hsla', {...state, hsla: e.target.value}),
  hwba: e => state => reduceBy('hwba', {...state, hwba: e.target.value}),
  cmyka: e => state => reduceBy('cmyka', {...state, cmyka: e.target.value}),

  gradientStop: e => state => {
    const {index, field} = e.target.dataset;
    return {
      ...state,
      gradientStop: [
        {...state.gradientStop[0], [field]: index === '0' ? e.target.value : state.gradientStop[0][field]},
        {...state.gradientStop[1], [field]: index === '1' ? e.target.value : state.gradientStop[1][field]}
      ]
    };
  },
  gradientType: e => state => ({...state, gradientType: e.target.dataset.gt}),
};

const initialState = {
  rgba: 'rgba(85, 0, 170, 0.75)',
  hex: '#50a',
  hsla: 'hsla(270, 100%, 33.33%, 0.75)',
  hwba: 'hwba(270, 0%, 33.33%, 0.75)',
  cmyka: 'cmyka(50%, 100%, 0%, 33.33%, 0.75)',
  parsed: { r: 85, g: 0, b: 170, a: 0.75 },

  gradientStop: [ { color: '#5500aa', pos: 0 }, { color: 'yellow', pos: 100 } ],
  gradientType: 'linear-gradient(to right',

  errors: {},
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'color');