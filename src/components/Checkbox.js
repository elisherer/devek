import { h } from 'hyperapp';
import styles from "./Checkbox.less";

export default ({ label, ...props}) => (
  <label className={styles.checkbox}>
    {label}
    <input type="checkbox" {...props} />
    <span className={styles.mark} />
  </label>
);
