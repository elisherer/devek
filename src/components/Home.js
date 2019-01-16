import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';

import tools from '../tools';
import styles from "./Home.less";

export default () => (state, actions) => (
  <div className={styles.page}>
    <div className={styles.wrap}>
      <section className={styles.textbox}>
        <input value={state.app.search} placeholder="Search" oninput={actions.app.search} oncreate={e => e.focus()}/>
      </section>

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