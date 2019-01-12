export const getInput = state => state.text && typeof state.text.input === 'string' ?state.text.input : '';

const actions = {
  text: {
    set: e => state => ({
      ...state,
      input: e.target.innerText
    }),
  }
};

export default actions;