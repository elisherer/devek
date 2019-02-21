import actions from 'actions';
import initialState from 'initialState';

actions.random = {
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
};

initialState.random = {
  size: 8,
  flags: 'aA0O',
  count: 1,
};

export const getFlags = state => state.random && typeof state.random.flags === 'string' ? state.random.flags : '';
export const getSize = state => state.random && typeof state.random.size === 'number' ? state.random.size : 0;
export const getCount = state => state.random && typeof state.random.count === 'number' ? state.random.count : 0;