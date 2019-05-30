import getEventLocation from './getEventLocation';
import createStore from "../../helpers/createStore";

let canvas;
let ctx;
let base64Source;

export const initCanvas = el => {
  if (ctx || !el.current) return;
  canvas = el.current;
  ctx = canvas.getContext('2d');
};

export const onMouseMove = e => {

};

const loadFile = (file, callback) => {
  if (typeof FileReader === "undefined" || !file || file.type.indexOf("image") === -1) return; // no file or not an image
  const reader = new FileReader();
  reader.onload = function(event){
      const img = new Image();
      img.onload = function(){
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img,0,0);
          callback(img.src);
      };
      img.src = event.target.result;
  };
  reader.readAsDataURL(file);     
};

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
  onDrop: e => state => {
    loadFile(e.dataTransfer.files && e.dataTransfer.files[0], actions.src);
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
  onMouseClick: e => state => {
    return { ...state, select: state.color }
  },
  file: e => (state, actions) => {
    loadFile(e.target.files && e.target.files[0], actions.src);
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
} = createStore(actionCreators, initialState);