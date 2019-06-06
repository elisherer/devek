import createStore from "../../helpers/createStore";

const actionCreators = {
  loaded: (width, height) => state => ({ ...state, loaded: true, resizeWidth: width, resizeHeight: height }),
  onDragEnter: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, dragging: state.dragging + 1};
  },
  onDragLeave: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, dragging: state.dragging - 1};
  },
  color: color => state => {
    return { ...state, color };
  },
  onMouseClick: () => state => {
    return { ...state, select: state.color }
  },
  resizeWidth: e => state => ({ ...state, resizeWidth: e.target.value }),
  resizeHeight: e => state => ({ ...state, resizeHeight: e.target.value }),
};

const initialState = {
  loaded: false,
  dragging: 0,
  color: '#dddddd',
  select: '#dddddd'
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'image');