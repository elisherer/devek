import createStore from 'helpers/createStore';

const actionCreators = {
  drawerOpen: () => state => ({
    ...state,
    drawer: true
  }),
  drawerClose: () => state => ({
    ...state,
    drawer: false
  })
};

const initialState = {
  drawer: false
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'app');