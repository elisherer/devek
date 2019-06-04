import createStore from "../../helpers/createStore";

let base64Source;

const actionCreators = {
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
  src: src => state => {
    base64Source = src;
    return { ...state, loaded: true };
  },
  open: () => state => {
    const w = window.open('about:blank');
    setTimeout(() => {
      const pre = w.document.createElement('pre');
      pre.style.overflowWrap = "break-word";
      pre.style.whiteSpace = "pre-wrap";
      pre.innerHTML = base64Source;
      w.document.body.appendChild(pre);
    }, 0);
    return state;
  }
};

const initialState = {
  dragging: 0,
  color: '#dddddd',
  select: '#dddddd'
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'image');