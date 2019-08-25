import createStore from "../../helpers/createStore";
import * as data from './data';

const filterParameters = (action, parameters) => data.actions[action].parameters ? Object.keys(data.actions[action].parameters).reduce((a,c) => {
  a[c] = parameters[c] || data.actions[action].defaults[c];
  return a;
}, {}) : null;

let counter = 0;
const keyCount = () => counter++;

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.innerText }),
  pickedAction: e => state => ({ ...state, pickedAction: e.target.value }),
  parameter: e => state => ({ ...state, parameters: { ...state.parameters, [e.target.dataset.name]: e.target.value }}),
  pipe: () => state => { 
    const actionParameters = filterParameters(state.pickedAction, state.parameters);
    return { 
      ...state, 
      pipe: state.pipe.concat({ 
        name: `${state.pickedAction}(${actionParameters ? Object.values(actionParameters) : ''})`,
        value: keyCount(),
        action: state.pickedAction, 
        parameters: actionParameters 
      }),
      selected: state.pipe.length,
    };
  },
  selectAction: e => state => ({ ...state, selected: e.target.selectedIndex }),
  remove: () => state => ({ 
    ...state, 
    pipe: state.pipe.filter((a,i) => i !== state.selected), 
    selected: state.selected < state.pipe.length - 1 ? state.selected : state.pipe.length - 1
  }),

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