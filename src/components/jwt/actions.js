import actions from 'actions';
import initialState from 'initialState';

import { decodeAsync } from "./jwt";

actions.jwt = {
  token: e => async (state, actions) => {
    const token = e.target.value,
      result = await decodeAsync(token, state.secret);
    actions.result({ token, secret: state.secret, result });
  },
  secret: e => async (state, actions) => {
    const secret = e.target.value,
      result = await decodeAsync(state.token, secret);
    actions.result({ token: state.token, secret, result });
  },
  result: ({ token, secret, result }) => state => ({
    ...state,
    token,
    secret,
    result
  }),
};

initialState.jwt = {
  token: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJzZWNyZXQtaXMiOiJaV3hwIn0',
    'e9H37jdA03uJoMwTPdMgTz6ITi68dUNkHMT3H1hlbS4'
  ].join('.'),
  result: [
    "{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}",
    "{\n  \"sub\": \"123456\",\n  \"name\": \"John Doe\",\n  \"secret-is\": \"ZWxp\"\n}",
    "e9H37jdA03uJoMwTPdMgTz6ITi68dUNkHMT3H1hlbS4"
  ]
};

const emptyArray = [];

export const getToken = state => state.jwt && typeof state.jwt.token === 'string' ? state.jwt.token : '';
export const getSecret = state => state.jwt && typeof state.jwt.secret === 'string' ? state.jwt.secret : '';
export const getResult = state => state.jwt && Array.isArray(state.jwt.result) ? state.jwt.result : emptyArray;