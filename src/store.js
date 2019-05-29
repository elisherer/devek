import { Provider } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';

const config = {
  initialState: {

  },
  actions: {
    setShape: (state, shape, options) => ({
      shape, options: { ...state.options, ...options }
    }),

  }
};

const reduxDevTools = (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) ? [window.__REDUX_DEVTOOLS_EXTENSION__()] : [];

const reducer = (state, action) =>
  config.actions.hasOwnProperty(action.type) ? {
    ...state,
    ...config.actions[action.type](state, ...action.args)
  } : state;

const store = createStore(reducer, config.initialState, ...reduxDevTools);

const actions = bindActionCreators(Object.keys(config.actions).reduce((a, type) => {
  a[type] = function() { return { type, args: arguments } };
  return a;
}, {}), store.dispatch);

export {
  Provider,
  store,
  actions,
};