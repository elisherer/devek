import { location } from '@hyperapp/router';
import initialState from './initialState';

const app = {
  drawer: () => state => ({
    ...state,
    drawer: !state.drawer
  }),
  location: () => state => state.drawer ? ({
    ...state,
    drawer: false
  }) : state,
  search: e => state => ({
    ...state,
    search: e.target.value
  }),
  refresh: () => state => ({
    ...state,
    refresh: !state.refresh
  }),
};

initialState.app = {
  drawer: false,
};

export default {
  location: location.actions,
  app,
};
