import { location } from '@hyperapp/router';
import initialState from './initialState';

const searchShortcutHandlerFactory = appActions => e => {
  if (e.key === "P" && e.ctrlKey && e.shiftKey) {
    appActions.openSearch();
    e.preventDefault();
  }
};
const closeSearchBoxHandlerFactory = appActions => e => {
  if (e.key === "Escape") {
    appActions.closeSearch();
    e.preventDefault();
  } else if (e.key === "Enter") {
    appActions.searchChoose();
    e.preventDefault();
  }
};
let searchShortcutHandler, closeSearchBoxHandler;

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
    search: e.target.value
  }),
  refresh: () => state => ({
    ...state,
    refresh: !state.refresh
  }),
  initSearch: () => (state, actions) => {
    searchShortcutHandler = searchShortcutHandlerFactory(actions);
    closeSearchBoxHandler = closeSearchBoxHandlerFactory(actions);
    addEventListener('keydown', searchShortcutHandler);
    return state;
  },
  openSearch: () => state => {
    removeEventListener('keydown', searchShortcutHandler);
    addEventListener('keyup', closeSearchBoxHandler);
    return {
      ...state,
      openSearch: true
    };
  },
  closeSearch: () => state => {
    addEventListener('keydown', searchShortcutHandler);
    removeEventListener('keyup', closeSearchBoxHandler);
    return {
      ...state,
      search: '',
      openSearch: false
    };
  },
  searchChoose: () => (state, actions) => {
    return state;
  }
};

initialState.app = {
  drawer: false,
};

export default {
  location: location.actions,
  app,
};
