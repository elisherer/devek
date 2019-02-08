import { location } from '@hyperapp/router';
import initialState from './initialState';
import sitemap from "./sitemap";

const closeSearchBoxHandlerFactory = appActions => e => {
  if (e.key === "Escape") {
    appActions.closeSearch();
    e.preventDefault();
  } else if (e.key === "ArrowDown") {
    appActions.searchDown();
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    appActions.searchUp();
    e.preventDefault();
  } else if (e.key === "Enter") {
    appActions.searchChoose();
    e.preventDefault();
  }
};
let closeSearchBoxHandler;

const app = {
  drawer: () => state => ({
    ...state,
    drawer: !state.drawer
  }),
  locationOnMobile: () => state => state.drawer ? ({
    ...state,
    drawer: false
  }) : state,
  search: e => state => ({
    ...state,
    search: e.target.value,
    paths: Object.keys(sitemap)
      .filter(t =>
        t !== window.location.pathname && (
          !state.search ||
          t.includes(state.search) ||
          sitemap[t].header.includes(state.search) ||
          sitemap[t].description.includes(state.search)
        )
      )
  }),
  refresh: () => state => ({
    ...state,
    refresh: !state.refresh
  }),
  initSearch: () => (state, actions) => {
    closeSearchBoxHandler = closeSearchBoxHandlerFactory(actions);
    return state;
  },
  searchDown: () => state => ({
    ...state,
    searchIndex: Math.min(state.searchIndex + 1, state.paths.length - 1)
  }),
  searchUp: () => state => ({
    ...state,
    searchIndex: Math.max(state.searchIndex - 1, 0)
  }),
  openSearch: () => state => {
    addEventListener('keyup', closeSearchBoxHandler);
    return {
      ...state,
      searchIndex: -1,
      openSearch: true
    };
  },
  closeSearch: () => state => {
    removeEventListener('keyup', closeSearchBoxHandler);
    return {
      ...state,
      search: '',
      searchIndex: -1,
      openSearch: false
    };
  },
  searchChoose: () => state => {
    if (state.search && (state.paths[state.searchIndex] || state.paths.length === 1)) {
      history.pushState(window.location.pathname, "", state.paths[state.searchIndex] || state.paths[0]);
      return {
        ...state,
        openSearch: false
      };
    }
    return state;
  }
};

initialState.app = {
  drawer: false,
  paths: []
};

export default {
  location: location.actions,
  app,
};
