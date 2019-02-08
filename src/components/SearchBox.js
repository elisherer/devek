import { h } from 'hyperapp';
import cc from 'classcat';
import { Link } from '@hyperapp/router';
import TextBox from './TextBox';

import sitemap from '../sitemap';
import styles from "./SearchBox.less";

let clickedLink = false;
const clickLinkHandler = () => clickedLink = true;

export default () => (state, actions) => {

  return (
    <div className={styles.search_modal}>
      <span style={{position: 'absolute', top: '16px', left: '16px' }}>🔍</span>
      <TextBox id="search_box" className={styles.search_box}
               placeholder="Search"
               value={state.app.search}
               onChange={actions.app.search} autofocus autocomplete="off" type="search"
               onblur={() => clickedLink ? (clickedLink = false) : actions.app.closeSearch()}
      />
      {state.app.search && state.app.paths.map((path, i) => (
          <Link key={path} to={path} className={cc([styles.item, { [styles.active]: i === state.app.searchIndex}])}
                onmousedown={clickLinkHandler}>
            <strong>{sitemap[path].title}</strong> - <span>{sitemap[path].description}</span>
          </Link>
        ))
      }
    </div>
  );
};