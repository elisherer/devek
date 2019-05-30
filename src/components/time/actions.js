import { reduceBy } from "./time";
import createStore from "../../helpers/createStore";

const actionCreators = {
  utc: () => state => reduceBy('epoch', { ...state, epoch: state.parsed.getTime(), timezone: 0 }),
  timezone: e => state => reduceBy('epoch', { ...state, epoch: state.parsed.getTime(), timezone: e.target.value }),
  iso: e => state => reduceBy('iso', { ...state, iso: e.target.value }),
  epoch: e => state => reduceBy('epoch', { ...state, epoch: e.target.value }),
  now: () => state => reduceBy('epoch', { ...state, epoch: Date.now() }),
  ampm: e => state => ({
    ...state,
    ampm: e.target.checked,
  }),

  refresh: () => state => ({ ...state, refresh: !state.refresh })
};

const now = new Date();

const initialState = {
  timezone: 0,
  iso: now.toISOString(),
  epoch: now.getTime().toString(),
  parsed: now,
  errors: {},
  ampm: false
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState);