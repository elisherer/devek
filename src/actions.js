import { location } from '@hyperapp/router';
import initialState from './initialState';

const app = {
  drawer: () => state => ({
    ...state,
    drawer: !state.drawer
  }),
  locationOnMobile: () => state => state.drawer ? ({
    ...state,
    drawer: false
  }) : state,
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
