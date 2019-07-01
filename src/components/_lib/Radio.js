import React from 'react';
import cx from 'classnames';
import styles from "./Radio.less";

const Radio = ({ className, children, options, value, onClick } : { className?: string, children?: any, options?: Array, value?: any, onClick?: Function }) => (
  <div className={cx(className, styles.radio)}>
    {options
      ? options.map(o => (
        <div key={o} data-active={value === o || null} data-value={o} onClick={onClick}>{o}</div>
      ))
      : children}
  </div>
);

export default Radio;