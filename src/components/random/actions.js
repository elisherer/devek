import createStore from "../../helpers/createStore";

const actionCreators = {
  flags: e => state => ({
    ...state,
    flags: state.flags.includes(e.target.dataset.flag) ? state.flags.replace(e.target.dataset.flag, '') : state.flags + e.target.dataset.flag
  }),
  size: e => state => ({
    ...state,
    size: parseInt(e.target.value)
  }),
  count: e => state => ({
    ...state,
    count: parseInt(e.target.value)
  }),

  refresh: () => state => ({ ...state, refresh: !state.refresh })
};

const initialState = {
  size: 8,
  flags: 'aA0O',
  count: 1,
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState);