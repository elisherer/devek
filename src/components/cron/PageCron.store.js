import Cron from "./cron";
import createStore from "helpers/createStore";

const actionCreators = {
  mode: mode => state => ({ ...state, mode }),
  exp: e => state => ({
    ...state,
    [state.mode]: { ...state[state.mode], exp: e.target.value }
  }),
  tab: e => state => ({
    ...state,
    [state.mode]: { ...state[state.mode], tab: e.target.dataset.tab }
  }),
  parse: () => state => {
    let parsed = null,
      error = null;
    try {
      parsed = Cron.parse(state[state.mode].exp, state.mode);
    } catch (e) {
      error = e.message;
    }

    return {
      ...state,
      [state.mode]: {
        ...state[state.mode],
        error,
        gen: error
          ? state[state.mode].gen
          : Object.keys(parsed).reduce(
              (gen, part) => {
                gen[part] = { ...gen[part], ...parsed[part] };
                return gen;
              },
              { ...state[state.mode].gen }
            )
      }
    };
  },
  type: e => state => ({
    ...state,
    [state.mode]: {
      ...state[state.mode],
      gen: {
        ...state[state.mode].gen,
        [state[state.mode].tab]: {
          ...state[state.mode].gen[state[state.mode].tab],
          type: e.target.dataset.type
        }
      }
    }
  }),
  args: e => state => ({
    ...state,
    [state.mode]: {
      ...state[state.mode],
      gen: {
        ...state[state.mode].gen,
        [state[state.mode].tab]: {
          ...state[state.mode].gen[state[state.mode].tab],
          type: e.target.dataset.type,
          [e.target.dataset.type]: e.target.value
        }
      }
    }
  }),
  arg0: e => state => ({
    ...state,
    [state.mode]: {
      ...state[state.mode],
      gen: {
        ...state[state.mode].gen,
        [state[state.mode].tab]: {
          ...state[state.mode].gen[state[state.mode].tab],
          type: e.target.dataset.type,
          [e.target.dataset.type]: [parseInt(e.target.value, 10)].concat(
            state[state.mode].gen[state[state.mode].tab][e.target.dataset.type].slice(1)
          )
        }
      }
    }
  }),
  arg1: e => state => ({
    ...state,
    [state.mode]: {
      ...state[state.mode],
      gen: {
        ...state[state.mode].gen,
        [state[state.mode].tab]: {
          ...state[state.mode].gen[state[state.mode].tab],
          type: e.target.dataset.type,
          [e.target.dataset.type]: state[state.mode].gen[state[state.mode].tab][
            e.target.dataset.type
          ]
            .slice(0, -1)
            .concat([parseInt(e.target.value, 10)])
        }
      }
    }
  })
};

const now = new Date();

const initState = mode => ({
  exp: mode === "crontab" ? "0 0 * * * *" : "0 0 0 ? * * *",
  tab: mode === "crontab" ? "minute" : "second",
  gen: {
    second:
      mode === "crontab"
        ? undefined
        : {
            type: ",",
            "/": [0, 1],
            "-": [0, 0],
            ",": [0]
          },
    minute: {
      type: ",",
      "/": [0, 1],
      "-": [0, 0],
      ",": [0]
    },
    hour: {
      type: ",",
      "/": [0, 1],
      "-": [0, 0],
      ",": [0]
    },
    day:
      mode === "crontab"
        ? {
            type: "*",
            "m/": [1, 1],
            "m,": [1],
            "w/": [1, 0],
            "w,": [0]
          }
        : {
            type: "*",
            "m/": [1, 1],
            "m,": [1],
            mL: [1],
            mW: [1],
            "w/": [1, 1],
            "w,": [1],
            wL: [1],
            "w#": [1, 1]
          },
    month: {
      type: "*",
      "/": [1, 1],
      "-": [1, 1],
      ",": [1]
    },
    year: {
      type: "*",
      "/": [now.getFullYear(), 1],
      "-": [now.getFullYear(), now.getFullYear()],
      ",": [now.getFullYear()]
    }
  }
});

const initialState = {
  crontab: initState("crontab"),
  quartz: initState("quartz")
};

export const { actions, useStore } = createStore(actionCreators, initialState, "cron");
