import React from 'react';
import styles from './RadioOption.less';

const RadioOption = ({ label, children, ...props } : { label: string, children: any, id: string }) => (
  <label htmlFor={props.id} className={styles.option}>
    {children || label}
    <input type="radio" {...props} />
    <span className={styles.mark} />
  </label>
);

export default RadioOption;