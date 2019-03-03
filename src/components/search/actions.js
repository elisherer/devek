import actions from 'actions';
import initialState from 'initialState';
import { flatMap } from "sitemap";

const index = Object.keys(flatMap);

let closeSearchBoxHandler;

const initialSearchState = {
  search: '',
  index: -1,
  open: false,
  paths: []
};

actions.search = {
  search: e => state => {
    const search = e.target.value;
    const lower = search.toLowerCase();
    return {
      ...state,
      search,
      paths: index.filter(t =>
        !flatMap[t].parent && // already appears in the search as a child
        !window.location.pathname.startsWith(t) && (
          (flatMap[t].keyword && flatMap[t].keyword.toLowerCase().includes(lower)) ||
          (flatMap[t].title && flatMap[t].title.toLowerCase().includes(lower)) ||
          (flatMap[t].header && flatMap[t].header.toLowerCase().includes(lower)) ||
          (flatMap[t].description && flatMap[t].description.toLowerCase().includes(lower))
        )
      )
    };
  },
  searchDown: () => state => ({
    ...state,
    index: Math.min(state.index + 1, state.paths.length - 1)
  }),
  searchUp: () => state => ({
    ...state,
    index: Math.max(state.index - 1, 0)
  }),
  open: () => (state, actions) => {
    if (state.open) return state;
    if (!closeSearchBoxHandler)
      closeSearchBoxHandler = e => {
        if (e.key === "Escape") {
          actions.close();
          e.preventDefault();
        } else if (e.key === "ArrowDown") {
          actions.searchDown();
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          actions.searchUp();
          e.preventDefault();
        } else if (e.key === "Enter") {
          actions.searchChoose();
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
  close: () => state => {
    if (!state.open) return state;
    removeEventListener('keyup', closeSearchBoxHandler);
    return initialSearchState;
  },
  searchChoose: () => state => {
    if (state.search && (state.paths[state.index] || state.paths.length === 1)) {
      history.pushState(window.location.pathname, "", state.paths[state.index] || state.paths[0]);
      return initialSearchState;
    }
    return state;
  }
};

initialState.search = initialSearchState;

export const getSearchOpen = state => state.search.open;
export const getSearch = state => state.search.search;
export const getSearchIndex = state => state.search.index;
export const getSearchPaths = state => state.search.paths;