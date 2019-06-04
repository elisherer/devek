import React, { useRef } from 'react';
import cx from 'classnames';
import styles from './PageImage.less';
import { useStore, actions } from './PageImage.store';
import getEventLocation from "./getEventLocation";

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

let _ref, canvas, ctx;

const initCanvas = ref => {
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
const onMouseMove = e => {
  const loc = getEventLocation(e);
  const pixelData = ctx.getImageData(loc[0], loc[1], 1, 1).data;
  actions.color(rgbToHex(pixelData[0],pixelData[1],pixelData[2]));
};

const onDrop = e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  loadFileAsync(file).then(actions.src);
  actions.onDragLeave(e);
};

const onFileChange = e => {
  const file = e.target.files && e.target.files[0];
  loadFileAsync(file).then(actions.src);
};

const PageImage = () => {
  const { dragging, loaded, color, select } = useStore();
  const canvasRef = useRef();
  initCanvas(canvasRef);

  const disabled = !loaded;

  return (
    <div  onDragEnter={actions.onDragEnter} onDragOver={onDragOver}
          onDragLeave={actions.onDragLeave} onDrop={onDrop}>
      <label className={cx(styles.dropbox, { [styles.dragging]: dragging })}>
        Click and browse for an image or Drag & Drop it here
        <input type="file" style={{display: 'none'}} onChange={onFileChange} />
      </label>
      <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
        <button disabled={disabled} onClick={actions.open}>To Base64</button>
        <div>Picker: <input disabled={disabled} type="color" value={color} /> ► <input disabled={disabled} type="color" value={select} /><input readOnly value={select} /></div>
      </div>
      <canvas ref={canvasRef}
        className={cx(styles.canvas, { [styles.visible]: loaded })}
        onMouseUp={actions.onMouseClick}
        onMouseMove={onMouseMove} />
    </div>
  );
};

export default PageImage;