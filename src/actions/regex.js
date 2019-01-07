export const getInput = state => state.regex && typeof state.regex.input === 'string' ?state.regex.input : '';
export const getTestString = state => state.regex && typeof state.regex.test === 'string' ?state.regex.test : '';

const actions = {
  regex: {
    set: (input) => state => ({
      ...state,
      input
    }),
    setTest: test => state => ({
      ...state,
      test
    }),
  }
};

export default actions;