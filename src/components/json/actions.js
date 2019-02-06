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

export const getInput = state => state.json && typeof state.json.input === 'string' ? state.json.input : '';
export const getPath = state => state.json && typeof state.json.path === 'string' ? state.json.path : '';
export const getParse = state => state.json && typeof state.json.parse === 'boolean' ? state.json.parse : false;