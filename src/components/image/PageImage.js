import { h } from 'hyperapp';
import cc from 'classcat';
import { initCanvas, onDragOver } from './actions';
import styles from './PageImage.less';

export default () => (state, actions) => {
  const { dragging } = state.image;
  const disabled = !state.image.loaded;
  return (
    <div ondragenter={actions.image.onDragEnter} ondragover={onDragOver}
    ondragleave={actions.image.onDragLeave} ondrop={actions.image.onDrop}>
      <label className={cc([styles.dropbox, { [styles.dragging]: dragging }])}>
        Click and browse for an image or Drag & Drop it here
        <input type="file" style={{display: 'none'}} onchange={actions.image.file} /> 
      </label>
      <div className={cc([styles.actions, { [styles.loaded]: state.image.loaded }])}>
        <button disabled={disabled} onclick={actions.image.open}>To Base64</button>
        <div>Picker: <input disabled={disabled} type="color" value={state.image.color} /> ► <input disabled={disabled} type="color" value={state.image.select} /><input readOnly value={state.image.select} /></div>
      </div>
      <canvas 
        className={cc([styles.canvas, { [styles.visible]: state.image.loaded }])} 
        oncreate={initCanvas} 
        onmouseup={actions.image.onMouseClick}
        onmousemove={actions.image.onMouseMove} />
    </div>
  );

}