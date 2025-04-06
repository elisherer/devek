import { reduceBy, subnetToMask } from "./network";
import createStore from "@/helpers/createStore";

const actionCreators = {
  ipv4: e => state => reduceBy("ipv4", { ...state, ipv4: e.target.value }),
  subnet: e => state => ({
    ...state,
    subnet: parseInt(e.target.value),
    mask: parseInt(subnetToMask(e.target.value), 2),
  }),
  myIP: myIP => state => ({ ...state, myIP }),
};

const initialState = {
  myIP: "",
  ipv4: "192.168.0.1",
  subnet: 24,
  mask: 0xffffff00,
  parsed: 0xc0a80001,
  errors: {},
};

export const { actions, useStore } = createStore(actionCreators, initialState, "network");
