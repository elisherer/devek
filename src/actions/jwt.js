export const getToken = state => state.jwt && typeof state.jwt.token === 'string' ? state.jwt.token : '';
export const getSecret = state => state.jwt && typeof state.jwt.secret === 'string' ? state.jwt.secret : '';

const actions = {
  jwt: {
    token: e => state => ({
      ...state,
      token: e.target.value
    }),
    secret: e => state => ({
      ...state,
      secret: e.target.value
    }),
  }
};

export default actions;