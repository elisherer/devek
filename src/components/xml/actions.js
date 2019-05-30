import createStore from "../../helpers/createStore";

const actionCreators = {
  xml: e => state => ({
    ...state,
    xml: e.target.innerText
  }),
  xpathToggle: () => state => ({
    ...state,
    xpathEnabled: !state.xpathEnabled,
  }),
  xpath: e => state => ({
    ...state,
    xpath: e.target.value,
  }),
};

const initialState = {
  xml: '',
  xpathEnabled: false,
  xpath: '/*',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState);