import { h } from 'hyperapp';

import styles from "./Tabs.less";

export default (_, children) => (
  <div className={styles.tabs}>
    {children}
  </div>
);