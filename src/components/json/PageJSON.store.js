import createStore from "@/helpers/createStore";

const actionCreators = {
  set: e => state => ({ ...state, input: e.target.innerText }),
  path: e => state => ({ ...state, path: e.target.value }),
  parse: e => state => ({ ...state, parse: e.target.checked }),
};

export const initialState = {
  input: '{"x":1}',
  path: "",
  parse: false,
};

export const { actions, useStore } = createStore(actionCreators, initialState, "json");
