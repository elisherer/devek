export const getRegex = state => state.regex && typeof state.regex.regex === 'string' ?state.regex.regex : '';
export const getTestString = state => state.regex && typeof state.regex.test === 'string' ?state.regex.test : '';
export const getWithReplace = state => state.regex && !!state.regex.withReplace;
export const getReplace = state => state.regex && typeof state.regex.replace === 'string' ?state.regex.replace : '';


const actions = {
  regex: {
    regex: e => state => ({
      ...state,
      regex: e.target.value
    }),
    testString: e => state => ({
      ...state,
      test: e.target.textContent
    }),
    withReplace: e => state => ({
      ...state,
      withReplace: e.target.checked
    }),
    replace: e => state => ({
      ...state,
      replace: e.target.value
    }),
  }
};

export default actions;