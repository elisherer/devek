import createStore from 'helpers/createStore';
import { getVoices } from './speech';

const actionCreators = {
  input: e => state => ({ ...state, input: e.target.textContent }),
  pitch: e => state => ({ ...state, pitch: e.target.value }),
  rate: e => state => ({ ...state, rate: e.target.value }),
  voice: e => state => ({ ...state, voice: e.target.value }),
  voices: () => state => { 
    const voices = getVoices();
    const voice = state.voice || voices.find(v => v.default)?.name;
    return { ...state, voices, voice };
  },
  speak: () => state => ({ ...state, speaking: true, paused: false }),
  pause: () => state => ({ ...state, paused: true }),
  resume: () => state => ({ ...state, paused: false }),
  stop: () => state => ({ ...state, speaking: false }),
};

const initialState = {
  input: 'Hello Devek',
  pitch: 1,
  rate: 1,
  voices: [],
  voice: '',
  speaking: false,
  paused: false
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'speech');