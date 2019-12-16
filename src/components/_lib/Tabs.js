import React from 'react';
import styles from './Tabs.less';

const Tabs = ({ className, children } : { className: string, children: any }) => (
  <nav className={styles.tabs + (className ? ' ' + className : '')}>
    {children}
  </nav>
);

export default Tabs;