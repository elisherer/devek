const composeFlags = on => ["g","m","i"].filter(flag => on.includes(flag)).join('');

const actions = {
  regex: (state, action) => ({
    ...state,
    regex: action.payload
  }),
    flags: (state, action) => {
      const flag = action.payload;
      return {
        ...state,
        flags: state.flags.includes(flag)
          ? state.flags.replace(flag, '')
          : composeFlags(state.flags + flag)
      };
    },
    testString: (state, action) => ({
    ...state,
    test: action.payload
  }),
    withReplace: (state, action) => ({
    ...state,
    withReplace: action.payload
  }),
    replace: (state, action) => ({
    ...state,
    replace: action.payload
  }),
};

export const reducer = (state, action) => {
  const reduce = actions[action.type];
  return reduce ? reduce(state, action) : state;
};

export const initialState =  {
  regex: '',
  flags: 'gm',
  test: '',
  withReplace: false,
  replace: '$&'
};