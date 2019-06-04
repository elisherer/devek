import getEventLocation from './getEventLocation';
import createStore from "../../helpers/createStore";

let _ref;
let canvas;
let ctx;
let base64Source;

export const initCanvas = ref => {
  _ref = ref;
  if (ctx || !ref.current) return;
  canvas = ref.current;
  ctx = canvas.getContext('2d');
};

const loadFileAsync = file => new Promise((resolve, reject) => {
  try {
    if (!canvas) initCanvas(_ref);
    if (typeof FileReader === "undefined" || !file || file.type.indexOf("image") === -1) return; // no file or not an image
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(img.src);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(reader.error.message);
      reader.abort();
    };
    reader.readAsDataURL(file);
  }
  catch (e) {
    reject(e.message);
  }
});

const rgbToHex = (r, g, b) => "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);

const actionCreators = {
  onDragEnter: e => state => {
    e.stopPropagation();
    e.preventDefault();
    return { ...state, dragging: true};
  },
  onDragLeave: e => state => {
    e.stopPropagation();
    e.preventDefault();
    return { ...state, dragging: false};
  },
  onDrop: e => async (state, actions) => {
    const src = await loadFileAsync(e.dataTransfer.files && e.dataTransfer.files[0]);
    actions.src(src);
    e.stopPropagation();
    e.preventDefault();
    return { ...state, dragging: false };
  },
  onMouseMove: function(e) { 
    return state => {
      const loc = getEventLocation(e);
      const pixelData = ctx.getImageData(loc[0], loc[1], 1, 1).data;
      const color = rgbToHex(pixelData[0],pixelData[1],pixelData[2]);
      return { ...state, color };
    }
  },
  onMouseClick: () => state => {
    return { ...state, select: state.color }
  },
  file: e => async (state, actions) => {
    const src = await loadFileAsync(e.target.files && e.target.files[0]);
    actions.src(src);
    return state;
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
  dragging: false,
  color: '#dddddd',
  select: '#dddddd'
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'image');