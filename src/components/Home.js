import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';

import tools from '../tools';
import styles from "./Home.less";

export default () => (
  <div className={styles.page}>
    <div className={styles.wrap}>
    {Object.keys(tools).map(a => (
      <Link key={a} to={'/' + a}>
        <div className={styles.item}>{tools[a].title}</div>
      </Link>
    ))}
    </div>
  </div>
);