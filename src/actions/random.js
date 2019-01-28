export const getFlags = state => state.random && typeof state.random.flags === 'string' ? state.random.flags : '';
export const getSize = state => state.random && typeof state.random.size === 'number' ? state.random.size : 0;

const actions = {
  random: {
    flags: e => state => ({
      ...state,
      flags: state.flags.includes(e.target.dataset.flag) ? state.flags.replace(e.target.dataset.flag, '') : state.flags + e.target.dataset.flag
    }),
    size: e => state => ({
      ...state,
      size: parseInt(e.target.value)
    }),
  }
};

export default actions;