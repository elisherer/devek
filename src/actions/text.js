export const getInput = state => state.text && typeof state.text.input === 'string' ?state.text.input : '';

const actions = {
  text: {
    set: (input) => state => ({
      ...state,
      input
    }),
  }
};

export default actions;