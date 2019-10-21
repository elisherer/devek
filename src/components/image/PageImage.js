import React, { useCallback } from 'react';
import cx from 'classnames';
import { TextBox } from '../_lib';
import { Redirect }  from 'react-router-dom';
import { useStore, actions } from './PageImage.store';
import getEventLocation from './getEventLocation';
import {
  loadFileAsync,
} from './image';
import { 
  mdiRotateLeft, 
  mdiRotateRight,
  mdiFlipHorizontal,
  mdiFlipVertical,
  mdiCpu64Bit,
  mdiInvertColors,
  mdiGradient,
  mdiImage,
  mdiCrop,
  mdiResize
} from '@mdi/js';
import Icon from '@mdi/react';

import styles from './PageImage.less';

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
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

  actions.cropInput({
    x, y, width: w - 2, height: h - 2
  });
};

let isDrawing = false, start_X, start_Y;

function onCropMouseUp(e) {
  isDrawing = false;
  e.target.style.cursor = "default";
}

function onCropMouseMove(e) {
  if (!isDrawing) return;
  const loc = getEventLocation(e);
  moveBand(start_X, start_Y, loc[0] - start_X, loc[1] - start_Y, 2);
}

function onCropMouseDown(e) {
  e.target.style.cursor = "crosshair";
  isDrawing = true;

  const loc = getEventLocation(e);
  start_X = loc[0];
  start_Y = loc[1];

  moveBand(start_X, start_Y, 0, 0);
}

const pageRoutes = ['', 'filters','crop','resize','picker'];

const PageImage = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || '')) {
    return <Redirect to={'/' + pathSegments[0] + '/' + pageRoutes[0]} />;
  }

  const { dragging, src, color, select, resize, crop } = useStore();

  const toBase64 = useCallback(() => {
    const w = window.open('about:blank');
    setTimeout(() => {
      const pre = w.document.createElement('pre');
      pre.style.overflowWrap = "break-word";
      pre.style.whiteSpace = "pre-wrap";
      pre.innerHTML = src;
      w.document.body.appendChild(pre);
    }, 0);
  }, [src]);

  const loaded = !!src;
  const disabled = !loaded;

  const picker = type === 'picker',
    cropper = type === 'crop';

  const dropHandlers = {
    onDragEnter: actions.onDragEnter,
    onDragLeave: actions.onDragLeave,
    onDragOver,
    onDrop
  };

  const dropBox = (
    <label className={cx(styles.dropbox, { [styles.dragging]: dragging })} {...dropHandlers}>
      Click and browse for an image or Drag & Drop it here
      <input type="file" style={{display: 'none'}} onChange={onFileChange} />
    </label>
  );

const toolbarClassName = cx(styles.actions, { [styles.loaded]: loaded });

  return (
    <>
      <section className={styles.toolbar} {...dropHandlers} >
        {!type && (
          <div className={toolbarClassName}>
            <button className="icon" disabled={disabled} onClick={actions.rotateRight} title="Rotate right"><Icon path={mdiRotateRight} size={1} /></button>
            <button className="icon" disabled={disabled} onClick={actions.rotateLeft} title="Rotate left"><Icon path={mdiRotateLeft} size={1} /></button>
            <button className="icon" disabled={disabled} onClick={actions.flipH} data-dir="h" title="Flip Horizontal"><Icon path={mdiFlipHorizontal} size={1}/></button>
            <button className="icon" disabled={disabled} onClick={actions.flipV} data-dir="v" title="Flip Vertical"><Icon path={mdiFlipVertical} size={1}/></button>
            <button className="icon" disabled={disabled} onClick={toBase64} title="To Base64"><Icon path={mdiCpu64Bit} size={1}/></button>
          </div>
        )}
        {type === 'filters' && (
          <div className={toolbarClassName}>
            <button className="icon" disabled={disabled} onClick={actions.invert} title="Invert Colors"><Icon path={mdiInvertColors} size={1}/></button>
            <button className="icon" disabled={disabled} onClick={actions.greyscale} title="Greyscale"><Icon path={mdiGradient} size={1}/></button>
            <button className="icon" disabled={disabled} onClick={actions.sepia} title="Sepia"><Icon path={mdiImage} color="#704214" size={1}/></button>
          </div>
        )}
        { type === 'crop' && (
          <div className={toolbarClassName}>
            <TextBox disabled={disabled} className={styles.inline} type="number" value={crop.x} data-input="x" onChange={actions.cropInput} />
            ,<TextBox disabled={disabled} className={styles.inline} type="number" value={crop.y} data-input="y" onChange={actions.cropInput} /> (
            <TextBox disabled={disabled} className={styles.inline} type="number" value={crop.width} data-input="width" onChange={actions.cropInput} /> x
            <TextBox disabled={disabled} className={styles.inline} type="number" value={crop.height} data-input="height" onChange={actions.cropInput} /> )
            &nbsp;
            <button className="icon" disabled={disabled} onClick={actions.crop} title="Crop"><Icon path={mdiCrop} size={1}/></button>
          </div>
        )}
        { type === 'resize' && (
          <div className={toolbarClassName}>
            <TextBox disabled={disabled} className={styles.inline} type="number" value={resize.width} data-input="width" onChange={actions.resizeInput} /> x <TextBox disabled={disabled} className={styles.inline} type="number" value={resize.height} data-input="height" onChange={actions.resizeInput} />
            &nbsp;
            <button className="icon" disabled={disabled} onClick={actions.resize} title="Resize"><Icon path={mdiResize} size={1}/></button>
          </div>
        )}
        { type === 'picker' && (
          <div className={toolbarClassName}>
            <div>Picker: <input disabled={disabled} type="color" readOnly value={color} /> ► <input disabled={disabled} readOnly type="color" value={select} />&nbsp;<TextBox className={styles.inline} readOnly value={select} /></div>
          </div>
        )}
        {type === 'crop' && (
          <div className={styles.hint}>* You can draw a rectangle on the image to set the coordinates before cropping</div>
        )}
      </section>
      {!loaded && dropBox}
      <section className={styles.canvas_wrapper} {...dropHandlers}>
        {cropper && loaded && <div className={styles.rubber_band} style={{ left: crop.x, top: crop.y, width: crop.width, height: crop.height }} />}
        {src && <img className={cx(styles.canvas, { [styles.visible]: loaded })}
          src={src} alt="" draggable={false}
          onMouseUp={picker ? actions.pick : cropper ? onCropMouseUp: undefined}
          onMouseMove={picker ? actions.peek : cropper ? onCropMouseMove: undefined}
          onMouseDown={cropper ? onCropMouseDown : undefined}
        />}
      </section>
    </>
  );
};

export default PageImage;