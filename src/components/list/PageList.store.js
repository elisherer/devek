import createStore from "../../helpers/createStore";

const transformations = {
  addComma: row => row.endsWith(',') ? row : row + ',',
  doubleQuotes: row => '"' + row + '"',
  singleQuotes: row => "'" + row + "'",
};

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.innerText }),
  transform: e => state => {
    const transform = e.target.dataset.transform;
    return { ...state, output: state.input.split('\n').map(transformations[transform]).join('\n') };
  },
  copy: e => state => {
    document.getElementById(e.target.dataset.copyto).innerText = state.output;
    return { ...state, input: state.output };
  },
  removeNewLines: () => state => ({ ...state, output: state.input.split('\n').join('') }),
  splitByComma: () => state => ({ ...state, output: state.input.split(',').join('\n') }),
};

const initialState = {
  input: '',
  output: '',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'list');