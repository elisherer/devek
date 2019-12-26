import Cron from './cron';
import createStore from 'helpers/createStore';

const actionCreators = {
  exp: e => state => ({ ...state, exp: e.target.value }),
  tab: e => state => ({ ...state, tab: e.target.dataset.tab }),
  parseCrontab: () => state => {
    console.log(Cron.parse(state.exp, 'crontab'));
    return state;
  },
  parseQuartz: () => state => {
    const parsed = Cron.parse(state.exp, 'quartz');
    console.log(parsed);
    return {
      ...state, 
      gen: Object.keys(parsed).reduce((gen,part) => {
        gen[part] = { ...gen[part], ...parsed[part] };
      }, { ...state.gen })
    };
  },
  type: e => state => ({
    ...state,
    gen: {
      ...state.gen,
      [state.tab]: {
        ...state.gen[state.tab],
        type: e.target.dataset.type
      }
    }
  }),
  args: e => state => ({
    ...state,
    gen: {
      ...state.gen,
      [state.tab]: {
        ...state.gen[state.tab],
        type: e.target.dataset.type,
        [e.target.dataset.type]: e.target.value,
      }
    }
  }),
  arg0: e => state => ({
    ...state,
    gen: {
      ...state.gen,
      [state.tab]: {
        ...state.gen[state.tab],
        type: e.target.dataset.type,
        [e.target.dataset.type]: [parseInt(e.target.value, 10)].concat(state.gen[state.tab][e.target.dataset.type].slice(1)),
      }
    }
  }),
  arg1: e => state => ({
    ...state,
    gen: {
      ...state.gen,
      [state.tab]: {
        ...state.gen[state.tab],
        type: e.target.dataset.type,
        [e.target.dataset.type]: state.gen[state.tab][e.target.dataset.type].slice(0, -1).concat([parseInt(e.target.value, 10)]),
      }
    }
  }),
  gen_second: '',
  gen_minute: '',
  gen_hour: '',
  gen_days: '',
  gen_month: '',
  gen_year: '',
};

const now = new Date();

const initialState = {
  exp: '0 0 0 ? * * *',
  tab: "second",
  gen: {
    second: {
      type: ',',
      '/': [0,1],
      '-': [0,0],
      ',': [0]
    },
    minute: {
      type: ',', 
      '/': [0,1],
      '-': [0,0],
      ',': [0]
    },
    hour: {
      type: ',', 
      '/': [0,1],
      '-': [0,0],
      ',': [0]
    },
    day: {
      type: '*',
      of: 'm',
      'm/': [1,1],
      'm,': [1],
      'mL': [0],
      'mW': [1],
      'w/': [1,0],
      'w,': [0],
      'wL': [1],
      'w#': [1,0]
    },
    month: {
      type: '*',
      '/': [1,1],
      '-': [1,1],
      ',': [1]
    },
    year: {
      type: '*',
      '/': [now.getFullYear(),1],
      '-': [now.getFullYear(), now.getFullYear()],
      ',': [now.getFullYear()]
    },
  },
  gen_output: '0 0 0 * * ? *',
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'cron');