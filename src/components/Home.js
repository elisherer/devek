import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import TextBox from './TextBox';

import tools from '../tools';
import styles from "./Home.less";

export default () => (state, actions) => (
  <div className={styles.page}>
    <div className={styles.wrap}>
      <TextBox className={styles.searchbox} placeholder="Search" value={state.app.search} onChange={actions.app.search} autofocus />

    {Object.keys(tools).filter(t => !state.app.search || t.includes(state.app.search)).map(a => (
      <Link key={a} to={'/' + a}>
        <div className={styles.item}>
          <h3>{tools[a].title}</h3>
          <p>{tools[a].description}</p>
        </div>
      </Link>
    ))}
    </div>
  </div>
);