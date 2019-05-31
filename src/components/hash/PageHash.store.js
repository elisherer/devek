import createStore from "../../helpers/createStore";

const cryptoAPI = window.crypto || window.msCrypto;

const actionCreators = {
  input: e => (state, actions) => {
    const input = e.target.innerText;
    actions.hash(input, state.alg);
    return { ...state, input };
  },
  alg: e => (state, actions) => {
    const alg = e.target.dataset.alg;
    actions.hash(state.input, alg);
    return { ...state, alg };
  },
  hash: (input, alg) => async state => {
    const buf = new TextEncoder('utf-8').encode(input);
    const hash = await cryptoAPI.subtle.digest(alg, buf);
    return { ...state, input, alg, hash };
  },
  format: e => state => ({
    ...state,
    outputFormat: e.target.dataset.format
  })
};

const initialState = {
  input: '',
  alg: 'SHA-256',
  error: '',
  hash: '',
  outputFormat: 'hex'
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'hash');