import React, {useEffect} from 'react';
import cx from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import TextBox from '../../lib/TextBox';
import { actions, useStore } from './SearchBox.store';

import styles from "./SearchBox.less";

let clickedLink = false;
const clickLinkHandler = () => clickedLink = true;
const onBlur = () => clickedLink ? (clickedLink = false) : actions.close();

const SearchBox = ({ location } : { location: Object }) => {
  const state = useStore();

  // location change
  useEffect(() => {
    actions.close();
  }, [location.pathname]);

  const { search, open, index, paths } = state;
  if (!open) return null;

  return (
    <div className={styles.search_modal}>
      <div className={styles.icon}>🔍</div>
      <TextBox id="search_box" className={styles.search_box}
               placeholder="Search"
               value={search}
               onChange={actions.search} autoFocus autoComplete="off" type="search"
               onBlur={onBlur}
      />
      {search && paths.map((p, i) => (
        <Link key={p.path} to={p.path} className={cx(styles.item, { [styles.active]: i === index})}
              onMouseDown={clickLinkHandler}>
          <strong>{p.title}</strong> - <span>{p.description}</span>
        </Link>
      ))
      }
    </div>
  );
};

const inputNodeNames = ['INPUT', 'TEXTAREA', 'PRE'];
const searchShortcutHandler = e => {
  if (e.key === "/" &&
    !e.altKey && !e.shiftKey && !e.ctrlKey &&
    !inputNodeNames.includes(e.target.nodeName)) {
    actions.open();
    setTimeout(() => {
      document.getElementById('search_box').focus();
    }, 0);
    e.preventDefault();
  }
};
addEventListener('keydown', searchShortcutHandler);

export default withRouter(SearchBox);