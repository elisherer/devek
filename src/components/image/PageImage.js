import { h } from 'hyperapp';
import cc from 'classcat';
import { initCanvas, onDragOver } from './actions';
import styles from './PageImage.less';

export default () => (state, actions) => {

  const { dragging } = state.image;

  return (
    <div ondragenter={actions.image.onDragEnter} ondragover={onDragOver}
    ondragleave={actions.image.onDragLeave} ondrop={actions.image.onDrop}>
      <label className={cc([styles.dropbox, { [styles.dragging]: dragging }])}>
        Click and browse for an image or Drag & Drop it here
        <input type="file" style={{display: 'none'}} onchange={actions.image.file} /> 
      </label>
      <canvas className={styles.canvas} oncreate={initCanvas} />
    </div>
  );

}