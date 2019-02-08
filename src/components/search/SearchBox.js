import { h } from 'hyperapp';
import cc from 'classcat';
import { Link } from '@hyperapp/router';
import TextBox from '../TextBox';
import {getSearch, getSearchIndex, getSearchOpen, getSearchPaths} from "./actions";
import sitemap from '../../sitemap';
import styles from "./SearchBox.less";

let clickedLink = false;
const clickLinkHandler = () => clickedLink = true;

export default () => (state, actions) => {
  const search = getSearch(state),
    open = getSearchOpen(state),
    index = getSearchIndex(state),
    paths = getSearchPaths(state);
  if (!open) return null;

  return (
    <div className={styles.search_modal}>
      <div className={styles.icon}>🔍</div>
      <TextBox id="search_box" className={styles.search_box}
               placeholder="Search"
               value={search}
               onChange={actions.search.search} autofocus autocomplete="off" type="search"
               onblur={() => clickedLink ? (clickedLink = false) : actions.search.close()}
      />
      {search && paths.map((path, i) => (
          <Link key={path} to={path} className={cc([styles.item, { [styles.active]: i === index}])}
                onmousedown={clickLinkHandler}>
            <strong>{sitemap[path].title}</strong> - <span>{sitemap[path].description}</span>
          </Link>
        ))
      }
    </div>
  );
};