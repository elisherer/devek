import React, { useRef } from 'react';
import cx from 'classnames';
import {Tabs, TextBox} from '../_lib';
import { NavLink, Redirect}  from "react-router-dom";
import { useStore, actions } from './PageImage.store';
import getEventLocation from "./getEventLocation";
import {
  toBase64,
  loadFileAsync,
  initCanvas,
  greyscale,
  invert,
  handleRotate,
  handleResize,
  handleCrop,
  sepia, flipH, flipV
} from './image';

import styles from './PageImage.less';

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

const rgbToHex = (r, g, b) => "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
const onMouseMove = e => {
  const loc = getEventLocation(e);
  const ctx = e.target.getContext('2d');
  const pixelData = ctx.getImageData(loc[0], loc[1], 1, 1).data;
  actions.color(rgbToHex(pixelData[0],pixelData[1],pixelData[2]));
};

const onDrop = e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  loadFileAsync(file, actions.loaded);
  actions.onDragLeave(e);
};

const onFileChange = e => {
  const file = e.target.files && e.target.files[0];
  loadFileAsync(file, actions.loaded);
};

const moveBand = (x,y,w,h) => {
  if (!w || !h) {
    w = 2; h = 2;
  }
  if (w < 0) {
    x += w;
    w = -w;
  }
  if (h < 0) {
    y += h;
    h = -h;
  }

  actions.crop({
    x, y, width: w -2, height: h - 2
  });
};

let isDrawing = false, start_X, start_Y;

function onCropMouseUp(e) {
  isDrawing = false;
  e.target.style.cursor = "default";
}

function onCropMouseMove(e) {
  if (isDrawing) {
    const loc = getEventLocation(e);
    moveBand(start_X, start_Y, loc[0] - start_X, loc[1] - start_Y, 2);
  }
}

function onCropMouseDown(e) {
  e.target.style.cursor = "crosshair";
  isDrawing = true;

  const loc = getEventLocation(e);
  actions.crop({
    x: loc[0], y: loc[1], width: 0, height: 0
  });
  start_X = loc[0];
  start_Y = loc[1];
}

const onCropButtonClick = e => {
  handleCrop(e);

  let width = parseInt(e.target.dataset.width),
    height = parseInt(e.target.dataset.height);

  actions.loaded(width, height);
};

const onResizeButtonClick = e => {
  handleResize(e);

  let width = parseInt(e.target.dataset.width),
    height = parseInt(e.target.dataset.height);

  actions.loaded(width, height);
};

const subPages = [
  {
    path: '',
    title: 'Actions',
  },
  {
    path: 'filters',
    title: 'Filters',
  },
  {
    path: 'crop',
    title: 'Crop',
  },
  {
    path: 'resize',
    title: 'Resize',
  },
  {
    path: 'picker',
    title: 'Color Picker',
  },
];

const PageImage = () => {
  const pathSegments = location.pathname.substr(1).split('/');

  const type = pathSegments[1];
  if (type && !subPages.find(sp => sp.path === type)) {
    return <Redirect to={`/${pathSegments[0]}/${subPages[0].path}`} />;
  }

  const { dragging, loaded, color, select, resize, crop } = useStore();
  const canvasRef = useRef();
  initCanvas(canvasRef);

  const disabled = !loaded;

  const tabs = (
    <Tabs>
      {subPages.map(subPage => (
        <NavLink key={subPage.path} to={`/${pathSegments[0]}/${subPage.path}`} exact={!subPage.path}>{subPage.title}</NavLink>
      ))}
    </Tabs>
  );


  const picker = type === 'picker',
    cropper = type === 'crop';

  return (
    <div  onDragEnter={actions.onDragEnter} onDragOver={onDragOver}
          onDragLeave={actions.onDragLeave} onDrop={onDrop}>
      <label className={cx(styles.dropbox, { [styles.dragging]: dragging })}>
        Click and browse for an image or Drag & Drop it here
        <input type="file" style={{display: 'none'}} onChange={onFileChange} />
      </label>
      {tabs}

      {!type && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
          <button disabled={disabled} onClick={handleRotate} data-angle="90">Rotate right</button>
          <button disabled={disabled} onClick={handleRotate} data-angle="270">Rotate left</button>
          <button disabled={disabled} onClick={flipH}>Flip H</button>
          <button disabled={disabled} onClick={flipV}>Flip V</button>
          <button disabled={disabled} onClick={toBase64}>To Base64</button>
        </div>
      )}
      {type === 'filters' && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
          <button disabled={disabled} onClick={greyscale}>Greyscale</button>
          <button disabled={disabled} onClick={invert}>Invert</button>
          <button disabled={disabled} onClick={sepia}>Sepia</button>
        </div>
      )}
      { type === 'crop' && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
          <TextBox disabled={disabled} className={styles.inline} type="number" value={crop.x} data-input="x" onChange={actions.cropInput} />
          ,<TextBox disabled={disabled} className={styles.inline} type="number" value={crop.y} data-input="y" onChange={actions.cropInput} /> (
          <TextBox disabled={disabled} className={styles.inline} type="number" value={crop.width} data-input="width" onChange={actions.cropInput} /> x
          <TextBox disabled={disabled} className={styles.inline} type="number" value={crop.height} data-input="height" onChange={actions.cropInput} /> )
          &nbsp;
          <button disabled={disabled} data-x={crop.x} data-y={crop.y} data-width={crop.width} data-height={crop.height} onClick={onCropButtonClick}>Crop</button>
          <div>* You can draw a rectangle on the image to set the coordinates before cropping</div>
        </div>
      )}
      { type === 'resize' && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
          <TextBox disabled={disabled} className={styles.inline} type="number" value={resize.width} data-input="width" onChange={actions.resizeInput} /> x <TextBox disabled={disabled} className={styles.inline} type="number" value={resize.height} data-input="height" onChange={actions.resizeInput} />
          &nbsp;
          <button disabled={disabled} data-width={resize.width} data-height={resize.height} onClick={onResizeButtonClick}>Resize</button>
        </div>
      )}
      { type === 'picker' && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
          <div>Picker: <input disabled={disabled} type="color" readOnly value={color} /> ► <input disabled={disabled} readOnly type="color" value={select} />&nbsp;<TextBox className={styles.inline} readOnly value={select} /></div>
        </div>
      )}
      <div className={styles.canvas_wrapper}>
        {cropper && loaded && <div className={styles.rubber_band} style={{ left: crop.x, top: crop.y, width: crop.width, height: crop.height }} />}
        <canvas ref={canvasRef}
          className={cx(styles.canvas, { [styles.visible]: loaded })}
          onMouseUp={picker ? actions.onMouseClick : cropper ? onCropMouseUp: undefined}
          onMouseMove={picker ? onMouseMove : cropper ? onCropMouseMove: undefined}
          onMouseDown={cropper ? onCropMouseDown : undefined}
        />
      </div>
    </div>
  );
};

export default PageImage;