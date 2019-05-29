import React, { useReducer } from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import TextBox from '../../lib/TextBox';
import { flatMap } from '../../sitemap';
import styles from "./SearchBox.less";

import { actions, initialState, init } from './actions';

let clickedLink = false;
const clickLinkHandler = () => clickedLink = true;

const reducer = (state, action) => {
  const reduce = actions[action.type];
  return reduce ? reduce(state, action) : state;
};

const SearchBox = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  init(dispatch);

  const { search, open, index, paths } = state;
  if (!open) return null;

  const searchChange = e => dispatch({ type: 'search', payload: e.target.value });

  return (
    <div className={styles.search_modal}>
      <div className={styles.icon}>🔍</div>
      <TextBox id="search_box" className={styles.search_box}
               placeholder="Search"
               value={search}
               onChange={searchChange} autoFocus autoComplete="off" type="search"
               onBlur={() => clickedLink ? (clickedLink = false) : dispatch({ type: 'close' }) }
      />
      {search && paths.map((path, i) => (
        <Link key={path} to={path} className={cx(styles.item, { [styles.active]: i === index})}
              onMouseDown={clickLinkHandler}>
          <strong>{flatMap[path].title}</strong> - <span>{flatMap[path].description}</span>
        </Link>
      ))
      }
    </div>
  );
};

export default SearchBox;