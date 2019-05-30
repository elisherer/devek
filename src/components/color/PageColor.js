import React from 'react';
import TextBox from '../../lib/TextBox';
import CopyToClipboard from "../../lib/CopyToClipboard";
import { useStore, actions } from './actions';
import { formatters } from './color.js';
import styles from './PageColor.less';
import webcolors from './webcolors';

let webcolorsDdl;

const PageColor = () => {

  const { errors, rgba, hex, hsla, hwba, cmyka, parsed } = useStore();

  const preview = { background: formatters.rgba(parsed) };

  if (!webcolorsDdl) {
    webcolorsDdl = (
      <select onChange={actions.webcolor}>
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
        <input type="color" onChange={actions.hex} value={formatters.hex(parsed)} />
      </div>

      <span>RGB/A:</span><CopyToClipboard from="color_rgba"/>
      <TextBox invalid={errors.rgba} id="color_rgba" autoFocus onChange={actions.rgba} value={rgba} />

      <span>Hex:</span><CopyToClipboard from="color_hex"/>
      <TextBox invalid={errors.hex} id="color_hex" onChange={actions.hex} value={hex}/>

      <span>HSL/A:</span><CopyToClipboard from="color_hsla"/>
      <TextBox invalid={errors.hsla} id="color_hsla" onChange={actions.hsla} value={hsla}/>

      <span>HWB/A:</span><CopyToClipboard from="color_hwba"/>
      <TextBox invalid={errors.hwba} id="color_hwba" onChange={actions.hwba} value={hwba}/>

      <span>CMYK/A:</span><CopyToClipboard from="color_cmyka"/>
      <TextBox invalid={errors.cmyka} id="color_cmyka" onChange={actions.cmyka} value={cmyka}/>

    </div>
  );
};

export default PageColor;