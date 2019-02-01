import actions from 'actions';

actions.text = {
  input: e => state => ({
    ...state,
    input: e.target.innerText
  }),
};

export const getInput = state => state.text && typeof state.text.input === 'string' ?state.text.input : '';