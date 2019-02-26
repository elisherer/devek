import actions from 'actions';
import initialState from "initialState";

actions.json = {
  set: e => state => ({
    ...state,
    input: e.target.innerText
  }),
  path: e => state => ({
    ...state,
    path: e.target.value
  }),
  parse: e => state => ({
    ...state,
    parse: e.target.checked
  })
};

initialState.json = {
  input: '{"x":1}',
};