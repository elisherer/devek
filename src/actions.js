import { location } from '@hyperapp/router';
import initialState from './initialState';
import {getJSONAsync} from "./helpers/http";

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
  ip: () => async (state, actions) => {
    try {
      const response = await getJSONAsync('/api/ip');
      actions.setIP(response.ip_address);
    }
    catch (e) {
      actions.setIP(e.message);
    }
  },
  setIP: ip => state => ({ ...state, ip }),
};

initialState.app = {
  drawer: false,
  ip: '',
};

export default {
  location: location.actions,
  app,
};
