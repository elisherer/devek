export const getInput = state => state.regex && typeof state.regex.input === 'string' ?state.regex.input : '';
export const getTestString = state => state.regex && typeof state.regex.test === 'string' ?state.regex.test : '';

const actions = {
  regex: {
    set: e => state => ({
      ...state,
      input: e.target.value
    }),
    setTest: e => state => ({
      ...state,
      test: e.target.textContent
    }),
  }
};

export default actions;