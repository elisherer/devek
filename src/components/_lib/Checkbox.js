import React from 'react';
import styles from './Checkbox.less';

const Checkbox = ({ label, children, ...props } : { label: string, children: any, id: string }) => (
  <label htmlFor={props.id} className={styles.checkbox}>
    {children || label}
    <input type="checkbox" {...props} />
    <span className={styles.mark} />
  </label>
);

export default Checkbox;