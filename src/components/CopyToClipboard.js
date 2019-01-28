import { h } from 'hyperapp';

import styles from "./CopyToClipboard.less";

const copyFrom = e => {
  const el = document.getElementById(e.target.dataset.from);
  if (typeof el.select === 'function') {
    el.select();
  }
  else {
    e.target.childNodes[0].textContent = el.innerText;
    e.target.childNodes[0].select();
  }
  document.execCommand("copy");
};

export default ({ from }, children) => (
  <span className={styles.copy} data-from={from} onclick={copyFrom}>
    <textarea />
    Copy
  </span>
);