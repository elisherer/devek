import {useReducer} from "react";

export default (actionCreators, initialState) => {
  const store = {};
  store.actions = Object.keys(actionCreators).reduce((a, type) => {
    a[type] = function() {
      const actionCreator = actionCreators[type].apply(this, arguments);
      if (typeof actionCreator === 'function') {
        store.dispatch({ type, payload: actionCreators[type].apply(this, arguments)(store.state, store.actions) });
      }
      else {
        actionCreator.then(func =>
          store.dispatch({ type, payload: func(store.state, store.actions) })
        )
      }
    };
    return a;
  }, {});
  const reducer = (state, action) => {
    if (actionCreators[action.type]) return action.payload;
    throw new Error(`Unknown type: ${action.type}`);
  };
  const useStore = () => {
    const _store = useReducer(reducer, initialState);
    store.state = _store[0];
    store.dispatch = _store[1];
    return _store[0];
  };
  return {
    store,
    actions: store.actions,
    useStore
  };
};