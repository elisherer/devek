import { h } from 'hyperapp';
import cc from 'classcat';
import styles from "./Radio.less";

export default ({ className }, children) => (
  <div className={cc([className, styles.radio])}>
    {children}
  </div>
);