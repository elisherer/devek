import React, { useRef } from 'react';
import cx from 'classnames';
import styles from './PageImage.less';
import { useStore, actions, initCanvas } from './actions';

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

const PageImage = () => {
  const { dragging, loaded, color, select } = useStore();
  const canvas = useRef();
  initCanvas(canvas);

  const disabled = !loaded;

  return (
    <div onDragEnter={actions.onDragEnter} onDragOver={onDragOver}
    onDragLeave={actions.onDragLeave} onDrop={actions.onDrop}>
      <label className={cx(styles.dropbox, { [styles.dragging]: dragging })}>
        Click and browse for an image or Drag & Drop it here
        <input type="file" style={{display: 'none'}} onChange={actions.file} />
      </label>
      <div className={cx(styles.actions, { [styles.loaded]: loaded })}>
        <button disabled={disabled} onClick={actions.open}>To Base64</button>
        <div>Picker: <input disabled={disabled} type="color" value={color} /> ► <input disabled={disabled} type="color" value={select} /><input readOnly value={select} /></div>
      </div>
      <canvas ref={canvas}
        className={cx(styles.canvas, { [styles.visible]: loaded })}
        onMouseUp={actions.onMouseClick}
        onMouseMove={actions.onMouseMove} />
    </div>
  );
};

export default PageImage;