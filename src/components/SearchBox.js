import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import TextBox from './TextBox';
import Modal from "./Modal";

import sitemap from '../sitemap';
import styles from "./SearchBox.less";

export default () => (state, actions) => (
  <Modal className={styles.search_modal} overlayClassName={styles.search_overlay} closeOnOverlayClick>

    <TextBox className={styles.search_box}
             placeholder="Search"
             value={state.app.search}
             onChange={actions.app.search} autofocus
             onkeyup={e => e.code === "Escape" && actions.app.closeSearch()} />
    {state.app.search && Object.keys(sitemap)
      .filter(t => !state.app.search || t.includes(state.app.search) || sitemap[t].header.includes(state.app.search) || sitemap[t].description.includes(state.app.search))
      .map(path => (
        <Link key={path} to={path} className={styles.item}>
          <strong>{sitemap[path].title}</strong> - <span>{sitemap[path].description}</span>
        </Link>
      ))
    }
  </Modal>
);