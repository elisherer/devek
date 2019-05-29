import createStore from "../../helpers/createStore";

const actionCreators = {
  input: e => state => ({
    ...state,
    input: e.target.innerText
  }),
};

const initialState = {
  input: '',
  errors: {}
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState);