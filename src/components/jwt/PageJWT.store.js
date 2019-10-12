import createStore from 'helpers/createStore';

import {decodeAsync, encodeAsync} from './jwt';

const actionCreators = {
  in_token: e => async (state, actions) => {
    const in_token = e.target.value,
      results = await decodeAsync(in_token, state.secret);
    actions.decode({ in_token, ...results });
  },
  secret: e => async (state, actions) => { // TODO: encode/decode
    const secret = e.target.value;

    if (state.encode) {
      const results = await encodeAsync('HS256', state.in_payload, secret);
      actions.encode({ secret, ...results });
    }
    else {
      const results = await decodeAsync(state.in_token, secret);
      actions.decode({ secret, ...results});
    }
  },
  decode: results => state => ({
    ...state,
    ...results,
    in_payload: results.payload
  }),
  encode: results => state => ({
    ...state,
    ...results,
    in_token: results.out_token,
    valid: true,
  }),
  in_payload: e => async (state, actions) => {
    const in_payload = e.target.innerText,
      results = await encodeAsync('HS256', in_payload, state.secret);
    actions.encode({ in_payload, ...results });
  },
  toggle: () => state => ({
    ...state,
    encode: !state.encode,
  }),
};


const initToken = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJzZWNyZXQtaXMiOiJaV3hwIn0',
  'e9H37jdA03uJoMwTPdMgTz6ITi68dUNkHMT3H1hlbS4'
].join('.');
const initialState = {
  in_token: initToken,
  out_token: initToken,
  header: "{\n  \"alg\": \"HS256\",\n  \"typ\": \"JWT\"\n}",
  payload: "{\n  \"sub\": \"123456\",\n  \"name\": \"John Doe\",\n  \"secret-is\": \"ZWxp\"\n}",
  in_payload: "{\n  \"sub\": \"123456\",\n  \"name\": \"John Doe\",\n  \"secret-is\": \"ZWxp\"\n}",
  sig: "e9H37jdA03uJoMwTPdMgTz6ITi68dUNkHMT3H1hlbS4",
  valid: false,
  alg: 'HS256',
  secret: ''
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'jwt');