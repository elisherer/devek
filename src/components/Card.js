import { h } from 'hyperapp';

import styles from "./Card.less";

export default ({ title }, children) => (
  <div className={styles.card}>
    <h1>{title}</h1>
    {children}
  </div>
);