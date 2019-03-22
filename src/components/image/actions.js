import actions from 'actions';
import initialState from 'initialState';

let canvas;
let ctx;

export const initCanvas = el => {
  if (ctx) return;
  canvas = el;
  ctx = canvas.getContext('2d');
};

const loadFile = file => {
  if (typeof FileReader === "undefined" || !file || file.type.indexOf("image") === -1) return; // no file or not an image
  const reader = new FileReader();
  reader.onload = function(event){
      const img = new Image();
      img.onload = function(){
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img,0,0);
      }
      img.src = event.target.result;
  }
  reader.readAsDataURL(file);     
};

export const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

actions.image = {
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
    loadFile(e.dataTransfer.files && e.dataTransfer.files[0]);
    e.stopPropagation();
    e.preventDefault();
    return { ...state, dragging: false };
  },
  file: e => state => {
    loadFile(e.target.files && e.target.files[0]);
    return state;
  }
};

initialState.image = {
  dragging: false,
};
