import React from 'react';
import cx from 'classnames';
import styles from "./Radio.less";

const Radio = ({ className, children } : { className: string, children: any }) => (
  <div className={cx(className, styles.radio)}>
    {children}
  </div>
);

export default Radio;