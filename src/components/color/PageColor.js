import React from 'react';
import {CopyToClipboard, ListBox, Radio, TextBox} from '../_lib';
import { Redirect }  from 'react-router-dom';
import { useStore, actions } from './PageColor.store';
import { formatters, parsers } from './color.js';
import styles from './PageColor.less';
import x11 from './x11';

const x11Colors = [{ name: 'custom', value: '#000000' }].concat(Object.keys(x11).map(wc => ({ name: wc, value: '#' + x11[wc] })));
const hexRegex = /#[a-z0-9]{6}/i;
const fixValue = value => {
  if (hexRegex.test(value)) return value;
  let el = document.createElement('div');
  el.style.color = value;
  let hex = window.getComputedStyle(document.body.appendChild(el)).color;
  document.body.removeChild(el);
  if (!hexRegex.test(hex)) {
    hex = formatters.hex(parsers.rgba(hex));
  }
  return hex;
};

const pageRoutes = ['convert','gradient'];

const PageColor = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || '')) {
    return <Redirect to={'/' + pathSegments[0] + '/' + pageRoutes[0]} />;
  }

  const state = useStore();

  if (type === 'convert') {

    const { errors, rgba, hex, hsla, hwba, cmyka, parsed } = state;

    const preview = { background: formatters.rgba(parsed) };

    return (
      <div>
        <label>Preview</label>
        <div className={styles.preview}>
          <div style={preview}/>
        </div>

        <div className={styles.predefined}>
          <label>Select an X11 web-color:</label>
          <ListBox size={1} value={formatters.hex(parsed)} onChange={actions.hex} options={x11Colors} uid={c => c.name} />
        </div>

        <div className={styles.predefined}>
          <span>Picker: </span>
          <input type="color" onChange={actions.hex} value={formatters.hex(parsed)}/>
        </div>

        <span>RGB/A:</span><CopyToClipboard from="color_rgba"/>
        <TextBox invalid={errors.rgba} id="color_rgba" autoFocus onChange={actions.rgba} value={rgba}/>

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
  }
  else if (type === 'gradient') {
    const { gradientStop, gradientType } = state;

    const gradientCss = `${gradientType}, ${gradientStop[0].color} ${gradientStop[0].pos}%,${gradientStop[1].color} ${gradientStop[1].pos}%)`;

    const preview = { background: gradientCss };

    const colorInput = index => (
      <>
        <span>Color {index+1}:</span> <input type="color" data-index={index} data-field="color" onChange={actions.gradientStop} value={fixValue(gradientStop[index].color)}/>
        <TextBox data-index={index} data-field="color" onChange={actions.gradientStop} value={gradientStop[index].color}/>
        <label>
          <span className={styles.positionLabel}>Position ({gradientStop[index].pos}%)</span>
          <input type="range" min="0" max="100" data-index={index} data-field="pos" value={gradientStop[index].pos} onChange={actions.gradientStop}/>
        </label>
      </>
    );

    return (
      <div>
        {colorInput(0)}
        {colorInput(1)}
        <button onClick={actions.switchColors}>Reverse order</button>

        <label>Gradient type</label>
        <Radio className={styles.gradients}>
          <div data-active={gradientType === 'linear-gradient(to left' || null} data-gt="linear-gradient(to left" onClick={actions.gradientType}
          style={{background: `linear-gradient(to left, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'linear-gradient(to right' || null} data-gt="linear-gradient(to right" onClick={actions.gradientType}
               style={{background: `linear-gradient(to right, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'linear-gradient(to top left' || null} data-gt="linear-gradient(to top left" onClick={actions.gradientType}
               style={{background: `linear-gradient(to top left, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'linear-gradient(to top right' || null} data-gt="linear-gradient(to top right" onClick={actions.gradientType}
               style={{background: `linear-gradient(to top right, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'linear-gradient(to bottom' || null} data-gt="linear-gradient(to bottom" onClick={actions.gradientType}
               style={{background: `linear-gradient(to bottom, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'linear-gradient(to top' || null} data-gt="linear-gradient(to top" onClick={actions.gradientType}
               style={{background: `linear-gradient(to top, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'linear-gradient(to bottom left' || null} data-gt="linear-gradient(to bottom left" onClick={actions.gradientType}
               style={{background: `linear-gradient(to bottom left, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'linear-gradient(to bottom right' || null} data-gt="linear-gradient(to bottom right" onClick={actions.gradientType}
               style={{background: `linear-gradient(to bottom right, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
          <div data-active={gradientType === 'radial-gradient(circle at center' || null} data-gt="radial-gradient(circle at center" onClick={actions.gradientType}
               style={{background: `radial-gradient(circle at center, ${gradientStop[0].color},${gradientStop[1].color})`}}/>
        </Radio>

        <span>Gradient CSS:</span><CopyToClipboard from="color_gradient"/>
        <TextBox id="color_gradient" value={gradientCss} readOnly />

        <label>Preview</label>
        <div className={styles.preview + ' ' + styles.gradient}>
          <div style={preview}/>
        </div>
      </div>
    )
  }
};

export default PageColor;