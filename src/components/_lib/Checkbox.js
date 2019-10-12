import React from 'react';
import styles from './Checkbox.less';

const Checkbox = ({ label, ...props } : { label: string }) => (
  <label className={styles.checkbox}>
    {label}
    <input type="checkbox" {...props} />
    <span className={styles.mark} />
  </label>
);

export default Checkbox;