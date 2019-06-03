import createStore from "../../helpers/createStore";

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.value }),
};

const initialState = {
  input: '',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'url');