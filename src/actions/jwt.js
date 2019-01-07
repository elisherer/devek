export const getToken = state => state.jwt && typeof state.jwt.token === 'string' ? state.jwt.token : '';
export const getHeader = state => state.jwt && typeof state.jwt.header === 'string' ? state.jwt.header : '';
export const getPayload = state => state.jwt && typeof state.jwt.payload === 'string' ? state.jwt.payload : '';
export const getSig = state => state.jwt && typeof state.jwt.sig === 'string' ? state.jwt.token : '';
export const getEncode = state => state.jwt && !!state.jwt.encode;

const actions = {
  jwt: {
    token: token => state => ({
      ...state,
      token
    }),
    header: header => state => ({
      ...state,
      header
    }),
    payload: payload => state => ({
      ...state,
      payload
    }),
    sig: sig => state => ({
      ...state,
      sig
    }),
    toggle: () => state => ({
      ...state,
      encode: !state.encode
    })
  }
};

export default actions;