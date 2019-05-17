import { h } from 'hyperapp';
import TextBox from '../TextBox';
import CopyToClipboard from "../CopyToClipboard";
import './actions';
import { formatters } from './color.js';
import styles from './PageColor.less';
import webcolors from './webcolors';

let webcolorsDdl;

export default () => (state, actions) => {

  const { errors, rgba, hex, hsla, hwba, cmyka, parsed } = state.color;

  const preview = { background: formatters.rgba(parsed) };

  if (!webcolorsDdl) {
    webcolorsDdl = (
      <select onchange={actions.color.webcolor}>
        {Object.keys(webcolors).map(wc => (
          <option style={{background:wc}} key={wc} value={wc}>{wc}</option>
        ))}
      </select>
    )
  }

  return (
    <div>
      <label>Preview</label>
      <div className={styles.preview}>
        <div style={preview}/>
      </div>

      <div className={styles.predefined}>
        <label>Choose a pre-defined web-color:</label>
        {webcolorsDdl}
      </div>

      <div className={styles.predefined}>
        <span>Picker: </span>
        <input type="color" onchange={actions.color.hex} value={formatters.hex(parsed)} />
      </div>

      <span>RGB/A:</span><CopyToClipboard from="color_rgba"/>
      <TextBox invalid={errors.rgba} id="color_rgba" autofocus onChange={actions.color.rgba} value={rgba} />

      <span>Hex:</span><CopyToClipboard from="color_hex"/>
      <TextBox invalid={errors.hex} id="color_hex" onChange={actions.color.hex} value={hex}/>

      <span>HSL/A:</span><CopyToClipboard from="color_hsla"/>
      <TextBox invalid={errors.hsla} id="color_hsla" onChange={actions.color.hsla} value={hsla}/>

      <span>HWB/A:</span><CopyToClipboard from="color_hwba"/>
      <TextBox invalid={errors.hwba} id="color_hwba" onChange={actions.color.hwba} value={hwba}/>

      <span>CMYK/A:</span><CopyToClipboard from="color_cmyka"/>
      <TextBox invalid={errors.cmyka} id="color_cmyka" onChange={actions.color.cmyka} value={cmyka}/>

    </div>
  );

}