import createStore from 'helpers/createStore';

const actionCreators = {
  loaded: (width, height) => state => ({ ...state, loaded: true, resize: { width, height }, crop: { x: 0, y: 0, width, height }}),
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
  resize: resize => state => ({ ...state, resize }),
  resizeInput: e => state => ({ ...state, resize: { ...state.resize, [e.target.dataset.input]: parseInt(e.target.value) } }),
  crop: crop => state => ({ ...state, crop }),
  cropInput: e => state => ({ ...state, crop: { ...state.crop, [e.target.dataset.input]: parseInt(e.target.value) } }),
};

const initialState = {
  loaded: false,
  dragging: 0,
  color: '#dddddd',
  select: '#dddddd',
  resize: { width: 0, height: 0 },
  crop: { x: 0, y: 0, width: 0, height: 0 }
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'image');