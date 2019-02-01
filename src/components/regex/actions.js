import actions from 'actions';
import initialState from 'initialState';

const composeFlags = on => ["g","m","i"].filter(flag => on.includes(flag)).join('');

actions.regex = {
  regex: e => state => ({
    ...state,
    regex: e.target.value
  }),
    flags: e => state => ({
    ...state,
    flags: state.flags.includes(e.target.dataset.flag) ? state.flags.replace(e.target.dataset.flag, '') : composeFlags(state.flags + e.target.dataset.flag)
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
};

initialState.regex =  {
  flags: 'gm',
};

export const getRegex = state => state.regex && typeof state.regex.regex === 'string' ?state.regex.regex : '';
export const getFlags = state => state.regex && typeof state.regex.flags === 'string' ?state.regex.flags : '';
export const getTestString = state => state.regex && typeof state.regex.test === 'string' ?state.regex.test : '';
export const getWithReplace = state => state.regex && !!state.regex.withReplace;
export const getReplace = state => state.regex && typeof state.regex.replace === 'string' ?state.regex.replace : '';