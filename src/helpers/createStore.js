import {useReducer} from "react";
import createDevTools from './devtools';

const resetActionType = '__RESET';

export default (actionCreators, initialState, name) => {
  const store = {
    dispatch: () => throw new Error("Don't call actions before calling useStore")
  };

  const devTools = createDevTools({ name, initialState, store});

  if (process.env.NODE_ENV === 'development') {
    actionCreators[resetActionType] = state => () => state; // ignoring the current state and setting it to a new one
  }

  store.actions = Object.keys(actionCreators).reduce((a, type) => {
    a[type] = function() {
      const payload = actionCreators[type].apply(this, arguments)(store.state, store.actions);
      const dispatch = payload => {
        if (typeof payload !== 'undefined')
          store.dispatch({type, payload });
      };

      if (payload && payload.then) { // Promise
        return payload.then(dispatch)
      }
      return dispatch(payload);
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

    if (process.env.NODE_ENV === 'development') {
      let d = _store[1];
      store.dispatch = a => {
        a.type !== resetActionType && devTools(name, a.type, a.payload);
        return d(a);
      };
      store.setState = state => d({ type: resetActionType, payload: state});
    } else
      store.dispatch = _store[1];

    return _store[0];
  };
  return {
    store,
    actions: store.actions,
    useStore
  };
};