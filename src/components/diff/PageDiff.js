import React from 'react';
import { Checkbox, CopyToClipboard, TextArea } from '../_lib';
import { useStore, actions } from './PageDiff.store';
import { textFunctions } from '../text/text';

import styles from './PageDiff.less';

const prepareLine = (nr, typ, aText) => {
  let output = "<tr><td>" + (nr >= 0 ? (nr+1) : "&nbsp;") + "<td><span style='width:100%'";
  if (typ) output += " class=\"" + typ + "\"";
  output += ">" + textFunctions.html.encode.func(aText) + "</span></td></tr>";
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
    error
  } = state;

  let output = '';

  if (result) {
    let n = 0;
    output = `<table class="${styles.output_table}">
      <colgroup>
        <col align="right" width="40">
        <col align="left" width="*">
      </colgroup>
      <tbody>`;
    for (let fdx = 0; fdx < result.diff.length; fdx++) {
      const item = result.diff[fdx];

      // write unchanged lines
      while ((n < item.startB) && (n < result.b.length)) {
        output += prepareLine(n, null, result.b[n]);
        n++;
      }

      // write deleted lines
      for (let m = 0; m < item.deletedA; m++) {
        output += prepareLine(-1, styles.d, result.a[item.startA + m]);
      }

      // write inserted lines
      while (n < item.startB + item.insertedB) {
        output += prepareLine(n, styles.i, result.b[n]);
        n++;
      }
    }

    // write rest of unchanged lines
    while (n < result.b.length) {
      output += prepareLine(n, null, result.b[n]);
      n++;
    }
    output += `</tbody></table>`;
  }

  return (
    <div>
      <label>Input A (&quot;old&quot;):</label>
      <TextArea autoFocus onChange={actions.inputA} value={inputA}/>

      <label>Input B (&quot;new&quot;):</label>
      <TextArea onChange={actions.inputB} value={inputB}/>

      <div className={styles.flags}>
        <Checkbox label="Trim spaces" checked={trimSpace} onChange={actions.trimSpace} />
        <Checkbox label="Ignore spaces" checked={ignoreSpace} onChange={actions.ignoreSpace} />
        <Checkbox label="Case sensitive" checked={!ignoreCase} onChange={actions.ignoreCase} />
      </div>

      <button onClick={actions.diff}>Diff</button>

      <h1>Result</h1>
      {!error && <CopyToClipboard from="diff_result" />}
      {error
        ? <p style={{color:'red'}}>{error}</p>
        : <TextArea readOnly html value={output} id="diff_result" />}
    </div>
  );
};

export default PageDiff;