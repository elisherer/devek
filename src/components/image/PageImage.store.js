import getEventLocation from './getEventLocation';
import createStore from "../../helpers/createStore";

let _ref;
let canvas;
let ctx;
let base64Source;

const rgbToHex = (r, g, b) => "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);

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
  onMouseMove: e => state => {
    const loc = getEventLocation(e);
    const pixelData = ctx.getImageData(loc[0], loc[1], 1, 1).data;
    const color = rgbToHex(pixelData[0],pixelData[1],pixelData[2]);
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