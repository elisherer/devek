export const getToken = state => state.jwt && typeof state.jwt.token === 'string' ? state.jwt.token : '';

const actions = {
  jwt: {
    token: e => state => ({
      ...state,
      token: e.target.value
    }),
  }
};

export default actions;