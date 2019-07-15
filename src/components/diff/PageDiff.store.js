import createStore from "../../helpers/createStore";
import { diffText } from "./diff";

const actionCreators = {
  inputA: e => state => ({ ...state, inputA: e.target.innerText }),
  inputB: e => state => ({ ...state, inputB: e.target.innerText }),
  trimSpace: e => state => ({ ...state, trimSpace: e.target.checked }),
  ignoreSpace: e => state => ({ ...state, ignoreSpace: e.target.checked }),
  ignoreCase: e => state => ({ ...state, ignoreCase: !e.target.checked }),
  diff: () => state => {
    const result = diffText(state.inputA, state.inputB, state.trimSpace, state.ignoreSpace, state.ignoreCase);
    return { ...state, result };
  }
};

export const initialState = {
  inputA: '',
  inputB: '',
  trimSpace: false,
  ignoreSpace: false,
  ignoreCase: false,
  result: '',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'diff');