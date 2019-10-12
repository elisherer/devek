import createStore from 'helpers/createStore';
import * as data from './data';

const filterParameters = (action, parameters) => data.actions[action].parameters ? Object.keys(data.actions[action].parameters).reduce((a,c) => {
  a[c] = parameters[c] || data.actions[action].defaults[c];
  return a;
}, {}) : null;

let counter = 1;
const keyCount = () => counter++;

const stringify = obj => Object.keys(obj).reduce((a,c) => a + (a ? ", " : '') + c + '=' + obj[c], '');

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.innerText }),
  pickedAction: e => state => ({ ...state, pickedAction: e.target.value }),
  parameter: e => state => ({ ...state, parameters: { ...state.parameters, [e.target.dataset.name]: e.target.value }}),
  pipe: () => state => { 
    const actionParameters = filterParameters(state.pickedAction, state.parameters);
    const pipe = state.pipe.concat({ 
      name: `${state.pickedAction}(${actionParameters ? stringify(actionParameters) : ''})`,
      value: keyCount(),
      action: state.pickedAction, 
      parameters: actionParameters 
    });
    return { 
      ...state, 
      pipe,
      selected: pipe[pipe.length - 1].value,
    };
  },
  selectAction: e => state => ({ ...state, selected: parseInt(e.target.value) }),
  remove: () => state => { 
    if (state.selected === null) return state;
    let removedIndex = -1;
    const pipe = state.pipe.filter((a, i) => { 
      if (a.value !== state.selected) return true; // leave it
      removedIndex = i;
      return false;
    });
    const newIndex = Math.min(removedIndex, pipe.length - 1);
    return { 
      ...state, 
      pipe, 
      selected: newIndex < 0 ? initialState.selected : pipe[newIndex].value,
    }; 
  },
  run: () => state => {
    const result = state.pipe.reduce((a, c) => data.actions[c.action].func(a, c.parameters), state.input);

    return { ...state, output: Array.isArray(result) ? (result.length === 1 ? result[0] : JSON.stringify(result, null, 2)) : result };
  },
};

const initialState = {
  input: '',
  pickedAction: 'Split',
  parameters: {},
  pipe: [],
  selected: 0,
  output: '',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'data');