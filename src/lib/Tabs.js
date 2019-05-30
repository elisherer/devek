import React from 'react';

import styles from "./Tabs.less";

const Tabs = ({ children } : { children: any }) => (
  <div className={styles.tabs}>
    {children}
  </div>
);

export default Tabs;