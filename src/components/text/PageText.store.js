import createStore from 'helpers/createStore';

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.innerText }),
  charmap: categories => state => ({ ...state, charmap: { ...state.charmap, categories }})
};

const initialState = {
  input: '',
  charmap: {
    categories: []
  }
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'text');