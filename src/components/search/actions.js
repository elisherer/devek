import { flatMap } from 'sitemap';
import {getHistory} from "../../helpers/history";
const index = Object.keys(flatMap);

let closeSearchBoxHandler,
  dispatch = null,
  initialized = false;
export const init = _dispatch => {
  if (initialized) return;
  initialized = true;
  dispatch = _dispatch;
  const inputNodeNames = ['INPUT', 'TEXTAREA', 'PRE'];
  const searchShortcutHandler = e => {
    if (e.key === "/" &&
      !e.altKey && !e.shiftKey && !e.ctrlKey &&
      !inputNodeNames.includes(e.target.nodeName)) {
      dispatch({ type: 'open' });
      setTimeout(() => {
        document.getElementById('search_box').focus();
      }, 0);
      e.preventDefault();
    }
  };
  addEventListener('keydown', searchShortcutHandler);
};

export const initialState = {
  search: '',
  index: -1,
  open: false,
  paths: []
};

export const actions = {
  search: (state, action) => {
    const search = action.payload;
    const lower = search.toLowerCase();
    return {
      ...state,
      search,
      paths: index.filter(t =>
        !flatMap[t].parent && // already appears in the search as a child
        !window.location.pathname.startsWith(t) && (
          (flatMap[t].keyword && flatMap[t].keyword.toLowerCase().includes(lower)) ||
          (flatMap[t].title && flatMap[t].title.toLowerCase().includes(lower)) ||
          (flatMap[t].description && flatMap[t].description.toLowerCase().includes(lower))
        )
      )
    };
  },
  search_down: state => ({
    ...state,
    index: Math.min(state.index + 1, state.paths.length - 1)
  }),
  search_up: state => ({
    ...state,
    index: Math.max(state.index - 1, 0)
  }),
  open: state => {
    if (state.open) return state;
    if (!closeSearchBoxHandler)
      closeSearchBoxHandler = e => {
        if (e.key === "Escape") {
          dispatch({ type: 'close' });
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          dispatch({ type: 'search_down' });
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          dispatch({ type: 'search_up' });
          e.preventDefault();
        } else if (e.key === "Enter") {
          dispatch({ type: 'search_choose' });
          e.preventDefault();
        }
      };
    addEventListener('keyup', closeSearchBoxHandler);
    return {
      ...state,
      index: -1,
      open: true
    };
  },
  close: state => {
    if (!state.open) return state;
    removeEventListener('keyup', closeSearchBoxHandler);
    return initialState;
  },
  search_choose: state => {
    if (state.search && (state.paths[state.index] || state.paths.length === 1)) {
      getHistory().push(state.paths[state.index] || state.paths[0]);
      return initialState;
    }
    return state;
  }
};