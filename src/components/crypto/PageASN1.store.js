import createStore from "helpers/createStore";

const actionCreators = {
  set: e => state => ({ ...state, input: e.target.innerText })
};

export const initialState = {
  input: ``
};

export const { actions, useStore } = createStore(actionCreators, initialState, "asn1");
