import createStore from "@/helpers/createStore";

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.innerText }),
  charmap: e => state => ({
    ...state,
    charmap: { ...state.charmap, categories: e.target.value },
  }),
};

const initialState = {
  input: "",
  charmap: {
    categories: [],
  },
};

export const { actions, useStore } = createStore(actionCreators, initialState, "text");
