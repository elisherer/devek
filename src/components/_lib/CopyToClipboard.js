import React from 'react';
import styles from "./CopyToClipboard.less";

const copyFrom = e => {
  let el = document.getElementById(e.target.dataset.from);
  if (typeof el.select !== 'function') {
    const textarea = e.target.firstChild;
    textarea.value = el.innerText;
    el = textarea;
  }
  el.select();
  document.execCommand("copy");
};

const CopyToClipboard = ({ from } : { from: string }) => (
  <span className={styles.copy} data-from={from} onClick={copyFrom}>
    <textarea />
    Copy
  </span>
);

export default CopyToClipboard;