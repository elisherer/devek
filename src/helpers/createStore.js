import {useReducer} from "react";

export default (actionCreators, initialState) => {
  const store = {};
  store.actions = Object.keys(actionCreators).reduce((a, type) => {
    a[type] = function() {
      const payload = actionCreators[type].apply(this, arguments)(store.state, store.actions);

      if (payload && payload.then) { // Promise
        payload.then(payload => {
          if (typeof payload !== 'undefined')
            store.dispatch({type, payload });
        })
      }
      else if (typeof payload !== 'undefined')
        store.dispatch({ type, payload });
    };
    return a;
  }, {});
  const reducer = (state, action) => {
    if (actionCreators[action.type]) return action.payload;
    throw new Error(`Unknown type: ${action.type}`);
  };
  const useStore = name => {
    const _store = useReducer(reducer, initialState);
    store.state = _store[0];

    if (process.env.NODE_ENV === 'development') {
      let d = _store[1];
      store.dispatch = a => {
        const bold = 'font-weight: bold';
        // eslint-disable-next-line
        console.info('🐛 %c' + (name || 'no-name') + ': %cType = %c' + a.type + '%c, Payload = %c' + JSON.stringify(a.payload),
          bold, '', bold, '', 'font-size: 8px');
        return d(a);
      };
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