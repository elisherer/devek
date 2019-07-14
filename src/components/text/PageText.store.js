import createStore from "../../helpers/createStore";

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.innerText }),
};

const initialState = {
  input: ''
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'text');