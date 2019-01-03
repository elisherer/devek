export const isLoggedIn = (state) => Boolean(state.login && state.login.loggedIn);

const actions = {
  login: {
    login: () => state => ({
      ...state,
      loggedIn: true
    }),
    logout: () => state => ({
      ...state,
      loggedIn: false
    }),
  }
};

export default actions;