import { h } from 'hyperapp';
import TextBox from '../TextBox';
import CopyToClipboard from "../CopyToClipboard";
import './actions';
//import { getWeek } from './color.js';
import styles from './PageColor.less';

export default () => (state, actions) => {

  const { errors, rgba, hex, parsed } = state.color;

  const preview = { background: `rgba(${parsed.r},${parsed.g},${parsed.b},${parsed.a})`};

  return (
    <div>
      <label>Preview</label>
      <div className={styles.preview}>
        <div style={preview}/>
      </div>

      <span>RGB/A:</span><CopyToClipboard from="color_rgba"/>
      <TextBox invalid={errors.rgba} id="color_rgba" autofocus onChange={actions.color.rgba} value={rgba} />

      <span>Hex:</span><CopyToClipboard from="color_hex"/>
      <TextBox invalid={errors.hex} id="color_hex" onChange={actions.color.hex} value={hex}/>

    </div>
  );

}