import createStore from "@/helpers/createStore";
import {
  handleRotate,
  handleFlip,
  handleInvert,
  handleGrayscale,
  handleSepia,
  handleCrop,
  handleResize,
  handleBlur,
  getColor,
} from "./image";
import getEventLocation from "./getEventLocation";

const setSize = (width, height) => ({
  width,
  height,
  resize: { width, height },
  crop: { x: 0, y: 0, width, height },
});

const actionCreators = {
  loaded: (width, height, src) => state => ({
    ...state,
    src,
    ...setSize(width, height),
  }),
  onDragEnter: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, dragging: state.dragging + 1 };
  },
  onDragLeave: e => state => {
    e.preventDefault();
    e.stopPropagation();
    return { ...state, dragging: state.dragging - 1 };
  },

  rotateRight: () => state => ({
    ...state,
    src: handleRotate((90 * Math.PI) / 180),
    ...setSize(state.height, state.width),
  }),
  rotateLeft: () => state => ({
    ...state,
    src: handleRotate((270 * Math.PI) / 180),
    ...setSize(state.height, state.width),
  }),
  flipH: () => state => ({ ...state, src: handleFlip("h") }),
  flipV: () => state => ({ ...state, src: handleFlip("v") }),

  invert: () => state => ({ ...state, src: handleInvert() }),
  grayscale: () => state => ({ ...state, src: handleGrayscale() }),
  sepia: () => state => ({ ...state, src: handleSepia() }),
  blur: () => state => ({ ...state, src: handleBlur() }),

  resizeInput: e => state => ({
    ...state,
    resize: {
      ...state.resize,
      [e.target.dataset.input]: parseInt(e.target.value),
    },
  }),
  resize: () => state => ({
    ...state,
    src: handleResize(state.resize.width, state.resize.height),
    ...setSize(state.resize.width, state.resize.height),
  }),
  cropInput: e => state => ({
    ...state,
    crop: e.x ? e : { ...state.crop, [e.target.dataset.input]: parseInt(e.target.value) },
  }),
  crop: () => state => ({
    ...state,
    src: handleCrop(state.crop),
    ...setSize(state.crop.width, state.crop.height),
  }),
  peek: e => state => ({ ...state, color: getColor(getEventLocation(e)) }),
  pick: () => state => ({ ...state, select: state.color }),
};

const initialState = {
  src: null,
  dragging: 0,
  color: "#dddddd",
  select: "#dddddd",
  resize: { width: 0, height: 0 },
  crop: { x: 0, y: 0, width: 0, height: 0 },
};

export const { actions, useStore } = createStore(actionCreators, initialState, "image");
