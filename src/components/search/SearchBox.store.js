import {getHistory} from "../../helpers/history";
import createStore from "../../helpers/createStore";
import {siteMap} from "../../sitemap";

const flatMap = Object.keys(siteMap).reduce((a,c) => {
  a[c] = siteMap[c];
  if (siteMap[c].children) {
    Object.keys(siteMap[c].children).forEach(path => {
      const child = siteMap[c].children[path];
      a[c + path] = {
        ...siteMap[c],
        ...child,
        title: siteMap[c].title + ' / ' + child.title,
      };
    });
    a[c].parent = true;
  }
  return a;
}, {});
const index = Object.keys(flatMap);

let closeSearchBoxHandler;

const initialState = {
  search: '',
  index: -1,
  open: false,
  paths: []
};

const actionCreators = {
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
          (flatMap[t].description && flatMap[t].description.toLowerCase().includes(lower))
        )
      ).map(path => ({ path, ...flatMap[path]}))
    };
  },
  search_down: () => state => ({
    ...state,
    index: Math.min(state.index + 1, state.paths.length - 1)
  }),
  search_up: () => state => ({
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
          actions.search_down();
          e.preventDefault();
        } else if (e.key === "ArrowUp") {
          actions.search_up();
          e.preventDefault();
        } else if (e.key === "Enter") {
          actions.search_choose();
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
    return initialState;
  },
  search_choose: () => state => {
    if (state.search && (state.paths[state.index] || state.paths.length === 1)) {
      getHistory().push(state.paths[state.index] ? state.paths[state.index].path : state.paths[0].path);
      return initialState;
    }
    return state;
  }
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'search');