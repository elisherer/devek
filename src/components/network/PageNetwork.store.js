import { reduceBy, subnetToMask } from "./network";
import {getJSONAsync} from "helpers/http";
import createStore from "../../helpers/createStore";

const actionCreators = {
  ipv4: e => state => reduceBy('ipv4', { ...state, ipv4: e.target.value }),
  subnet: e => state => ({ 
    ...state, 
    subnet: parseInt(e.target.value), 
    mask: parseInt(subnetToMask(e.target.value), 2) 
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

const initialState = {
  ip: '',
  ipv4: '192.168.0.1',
  subnet: 24,
  mask: 0xFFFFFF00,
  parsed: 0xC0A80001,
  errors: {},
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'network');