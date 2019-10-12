import React from 'react';
import styles from './CopyToClipboard.less';

const copyFrom = e => {
  let el = document.getElementById(e.target.dataset.from);
  let ta;
  if (el.nodeName === 'PRE') {
    ta = e.target.firstChild;
    ta.value = el.textContent || '\0';
    el = ta;
  }
  el.select();
  document.execCommand("copy", false, null);
  if (ta) {
    ta.value = '';
  }
};

const CopyToClipboard = ({ from } : { from: string }) => (
  <span className={styles.copy} data-from={from} onClick={copyFrom}>
    <textarea />
    Copy
  </span>
);

export default CopyToClipboard;