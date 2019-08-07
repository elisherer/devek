import React from 'react';
import cx from 'classnames';
import styles from "./Radio.less";

const Radio = ({ className, children, options, value, onClick, showEmptyWith } :
                 { className?: string, children?: any, options?: Array, value?: any, onClick?: Function, showEmptyWith?: string }) => (
  <div className={cx(className, styles.radio)}>
    {options
      ? options.map(o => (
        (o || showEmptyWith) && <div key={o || showEmptyWith} data-active={value === o || null} data-value={o} onClick={onClick}>{o || showEmptyWith}</div>
      ))
      : children}
  </div>
);

export default Radio;