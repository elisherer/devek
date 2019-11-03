import createStore from 'helpers/createStore';
import * as data from './data';

const filterParameters = (action, parameters) => data.actions[action].parameters ? Object.keys(data.actions[action].parameters).reduce((a,c) => {
  a[c] = parameters[c] || data.actions[action].defaults[c];
  return a;
}, {}) : null;

const stringify = obj => Object.keys(obj).reduce((a,c) => a + (a ? ", " : '') + c + '=' + obj[c], '');

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.innerText }),
  pickedAction: e => state => ({ ...state, pickedAction: e.target.value }),
  parameter: e => state => ({ ...state, parameters: { ...state.parameters, [e.target.dataset.name]: e.target.value }}),
  pipe: () => state => { 
    const actionParameters = filterParameters(state.pickedAction, state.parameters);
    const pipe = state.pipe.concat({ 
      name: `${state.pickedAction}(${actionParameters ? stringify(actionParameters) : ''})`,
      action: state.pickedAction, 
      parameters: actionParameters 
    });
    return { 
      ...state, 
      pipe,
      selected: pipe.length - 1,
    };
  },
  selectAction: e => state => ({ ...state, selected: parseInt(e.target.selectedIndex) }),
  moveDown: () => state => {
    if (state.selected === -1 || state.selected === state.pipe.length - 1) return state;
    const clone = state.pipe.slice();
    clone.splice(state.selected + 1, 0, clone.splice(state.selected, 1)[0])
    return { 
      ...state, 
      pipe: clone, 
      selected: state.selected + 1,
    }; 
  },
  moveUp: () => state => {
    if (state.selected <= 0) return state;
    const clone = state.pipe.slice();
    clone.splice(state.selected - 1, 0, clone.splice(state.selected, 1)[0])
    return { 
      ...state, 
      pipe: clone, 
      selected: state.selected - 1,
    }; 
  },
  remove: () => state => { 
    if (state.selected === -1) return state;
    const pipe = state.pipe.filter((a, i) => i !== state.selected);
    const newIndex = Math.min(state.selected, pipe.length - 1);
    return { 
      ...state, 
      pipe, 
      selected: state.selected < 0 ? 0 : newIndex,
    }; 
  },
  run: () => state => {
    const result = state.pipe.reduce((a, c) => data.actions[c.action].func(a, c.parameters), state.input);

    return { 
      ...state, 
      timestamp: new Date(),
      output: Array.isArray(result) ? (result.length === 1 ? result[0] : JSON.stringify(result, null, 2)) : result 
    };
  },
};

const initialState = {
  input: '',
  pickedAction: 'Split',
  parameters: {},
  pipe: [],
  selected: -1,
  output: '',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'data');