import React, { useRef } from 'react';
import cx from 'classnames';
import {Tabs, TextBox} from '../_lib';
import { NavLink, Redirect}  from "react-router-dom";
import { useStore, actions } from './PageImage.store';
import getEventLocation from "./getEventLocation";
import {toBase64, loadFileAsync, initCanvas, greyscale, invert, resize} from './image';

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

const PageImage = () => {
  const pathSegments = location.pathname.substr(1).split('/');

  const type = pathSegments[1];
  if (type && !['picker','resize','crop'].includes(type)) {
    return <Redirect to={`/${pathSegments[0]}`} />;
  }


  const { dragging, loaded, color, select, resizeWidth, resizeHeight } = useStore();
  const canvasRef = useRef();
  initCanvas(canvasRef);

  const disabled = !loaded;

  const tabs = (
    <Tabs>
      <NavLink to={`/${pathSegments[0]}`} exact>Actions</NavLink>
      <NavLink to={`/${pathSegments[0]}/crop`}>Crop</NavLink>
      <NavLink to={`/${pathSegments[0]}/resize`}>Resize</NavLink>
      <NavLink to={`/${pathSegments[0]}/picker`}>Color Picker</NavLink>
    </Tabs>
  );

  const picker = type === 'picker';

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
          <button disabled={disabled} onClick={greyscale}>Greyscale</button>
          <button disabled={disabled} onClick={invert}>Invert</button>
          <button disabled={disabled} onClick={toBase64}>To Base64</button>
        </div>
      )}
      { type === 'crop' && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>

        </div>
      )}
      { type === 'resize' && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
          <TextBox disabled={disabled} className={styles.inline} type="number" value={resizeWidth} onChange={actions.resizeWidth} /> x <TextBox disabled={disabled} className={styles.inline} type="number" value={resizeHeight} onChange={actions.resizeHeight} />
          &nbsp;
          <button disabled={disabled} data-width={resizeWidth} data-height={resizeHeight} onClick={resize}>Resize</button>
        </div>
      )}
      { type === 'picker' && (
        <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
          <div>Picker: <input disabled={disabled} type="color" value={color} /> ► <input disabled={disabled} type="color" value={select} />&nbsp;<TextBox className={styles.inline} readOnly value={select} /></div>
        </div>
      )}

      <canvas ref={canvasRef}
        className={cx(styles.canvas, { [styles.visible]: loaded })}
        onMouseUp={picker ? actions.onMouseClick : undefined}
        onMouseMove={picker ? onMouseMove : undefined} />
    </div>
  );
};

export default PageImage;