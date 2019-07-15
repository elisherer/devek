import React from 'react';
import { Checkbox, CopyToClipboard, TextArea } from '../_lib';
import { useStore, actions } from './PageDiff.store';
import { textFunctions } from '../text/text';

import styles from './PageDiff.less';

const he = textFunctions.html.encode.func;

const prepareLine = (nr, typ, aText) => {
  let output = "<tr><td>" + (nr >= 0 ? (nr+1) : "&nbsp;") + "<td><span style='width:100%'";
  if (typ) output += " class=\"" + typ + "\"";
  output += ">" + he(aText) + "</span></td></tr>";
  return output;
};

const prepareLines = (diff, a, b) => {
  let n = 0,
    output = `<table class="${styles.output_table}"><tbody>`;

  for (let fdx = 0; fdx < diff.length; fdx++) {
    const item = diff[fdx];

    // write unchanged lines
    while (n < item.startB && n < b.length) {
      output += prepareLine(n, null, b[n]);
      n++;
    }

    // write deleted lines
    for (let m = 0; m < item.deletedA; m++) {
      output += prepareLine(-1, styles.d, a[item.startA + m]);
    }

    // write inserted lines
    while (n < item.startB + item.insertedB) {
      output += prepareLine(n, styles.i, b[n]);
      n++;
    }
  }

  // write rest of unchanged lines
  while (n < b.length) {
    output += prepareLine(n, null, b[n]);
    n++;
  }
  output += `</tbody></table>`;
  return output;
};

const prepareBlocks = (diff, a, b) => {
  let n = 0,
    output = ``;

  for (let fdx = 0; fdx < diff.length; fdx++) {
    const item = diff[fdx];

    // write unchanged blocks
    while (n < item.startB && n < b.length) {
      output += he(b[n]);
      n++;
    }

    // write deleted blocks
    for (let m = 0; m < item.deletedA; m++) {
      output += `<span class="${styles.d}">${he(a[item.startA + m])}</span>`;
    }

    // write inserted blocks
    while (n < item.startB + item.insertedB) {
      output += `<span class="${styles.i}">${he(b[n])}</span>`;
      n++;
    }
  }

  // write rest of unchanged lines
  while (n < b.length) {
    output += he(b[n]);
    n++;
  }
  return output;
};


const PageDiff = () => {
  const state = useStore();

  const {
    inputA,
    inputB,
    trimSpace,
    ignoreSpace,
    ignoreCase,
    result,
    type,
    error
  } = state;

  const output = !result
    ? ''
    : type === 'line'
      ? prepareLines(result.diff, result.a, result.b)
      : prepareBlocks(result.diff, result.a, result.b);

  return (
    <div>
      <label>Input A (&quot;old&quot;):</label>
      <TextArea autoFocus onChange={actions.inputA} value={inputA}/>

      <div className={styles.b}>
        <label>Input B (&quot;new&quot;):</label>
        <TextArea onChange={actions.inputB} value={inputB}/>
      </div>

      <div className={styles.flags}>
        <Checkbox label="Trim spaces" checked={trimSpace} onChange={actions.trimSpace} />
        <Checkbox label="Ignore spaces" checked={ignoreSpace} onChange={actions.ignoreSpace} />
        <Checkbox label="Case sensitive" checked={!ignoreCase} onChange={actions.ignoreCase} />
      </div>

      <div className={styles.actions}>
        <button onClick={actions.lineDiff}>Line Diff</button>
        <button onClick={actions.blockDiff}>Block Diff</button>
      </div>

      <h1>Result</h1>
      {!error && <CopyToClipboard from="diff_result" />}
      {error
        ? <p style={{color:'red'}}>{error}</p>
        : <TextArea readOnly html value={output} id="diff_result" />}
    </div>
  );
};

export default PageDiff;