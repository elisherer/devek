import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import TextBox from './TextBox';

import sitemap from '../sitemap';
import styles from "./Home.less";

export default () => (state, actions) => (
  <div className={styles.page}>
    <img src={require('../assets/devek-logo-black-with-text.min.svg')} />
    <TextBox className={styles.searchbox} placeholder="Search" value={state.app.search} onChange={actions.app.search} autofocus />

    {state.app.search && Object.keys(sitemap).filter(t => !state.app.search || t.includes(state.app.search)).map(path => (
      <Link key={path} to={path} className={styles.item}>
        <strong>{sitemap[path].title}</strong> - <span>{sitemap[path].description}</span>
      </Link>
    ))}
  </div>
);