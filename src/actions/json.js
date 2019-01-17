export const getInput = state => state.json && typeof state.json.input === 'string' ?state.json.input : '';
export const getPath = state => state.json && typeof state.json.path === 'string' ?state.json.path : '';

const actions = {
  json: {
    set: e => state => ({
      ...state,
      input: e.target.innerText
    }),
    path: e => state => ({
      ...state,
      path: e.target.value
    }),
  }
};

export default actions;