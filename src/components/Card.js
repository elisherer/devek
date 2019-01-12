import { h } from 'hyperapp';

import styles from "./Card.less";

export default ({ header, title }, children) => (
  <div className={styles.card}>
    {header || <h1>{title}</h1>}
    {children}
  </div>
);