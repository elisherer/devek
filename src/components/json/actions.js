import { useReducer } from 'react';

export const initialState = {
  input: '{"x":1}',
  path: '',
  parse: false,
};

const reducers = {
  set: (state, { payload: [e] }) => ({
    ...state,
    input: e.target.innerText
  }),
  path: (state, { payload: [e] }) => ({
    ...state,
    path: e.target.value
  }),
  parse: (state, { payload: [e] }) => ({
    ...state,
    parse: e.target.checked
  })
};

const store = {};
export const actions = Object.keys(reducers).reduce((a, type) => {
  a[type] = function() { store.dispatch({ type, payload: arguments }); };
  return a;
}, {});

const reducer = (state, action) => {
  const reduce = reducers[action.type];
  if (reduce) return reduce(state, action);
  throw new Error(`Unknown type: ${action.type}`);
};

export const getState = () => {
  const _store = useReducer(reducer, initialState);
  if (!store.dispatch) {
    store.dispatch = _store[1];
  }
  return _store[0];
};