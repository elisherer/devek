const actions = {
  input: (state, action) => ({
    ...state,
    input: action.payload
  }),
};

export const reducer = (state, action) => {
  const reduce = actions[action.type];
  return reduce ? reduce(state, action) : state;
};

export const initialState = {
  input: '',
  errors: {}
};