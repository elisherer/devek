import React, { useReducer } from 'react';
import { Switch, Route, Link, NavLink, withRouter } from 'react-router-dom';
import Helmet from 'react-helmet';
import cx from 'classnames';
import SearchBox from './search/SearchBox';
import NotFound from './NotFound';
import { siteMap } from '../sitemap';
import pages from '../pages';
import styles from './App.less';

const reducer = (state, action) => {
  switch (action.type) {
    case 'drawer':
      return {
        ...state,
        drawer: !state.drawer
      };
  }
  return state;
};

const initialState = {
  drawer: false
};

const App = ({ location } : { location: Object }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleDrawer = () => dispatch({ type: 'drawer'});

  let header;

  return (
    <div className={styles.app}>
      <nav className={cx(styles.nav,{ [styles.open]: state.drawer })}>
      <div className={styles.menu} onClick={toggleDrawer}/>
        {Object.keys(siteMap).map(path => {
          const active = location.pathname === path || location.pathname.startsWith(path + '/');
          if (active) {
            header = siteMap[path].header;
          }

          return path === '/' ? <React.Fragment key={path}>
            <Link to="/" className={styles.logo}/>
            <div className={styles.search_hint}>Press <kbd>/</kbd> to search</div>
          </React.Fragment> : (
            <NavLink key={path} to={path} className={styles.menuitem} activeClassName={styles.active}>
              {siteMap[path].title}
            </NavLink>
          );
        })}
      </nav>
      <main className={styles.main}>
        <Helmet>
          <title>{header && location.pathname !== "/" ? `Devek - ${header}` : 'Devek'}</title>
        </Helmet>
        {state.drawer && <div className={styles.overlay} onClick={toggleDrawer} /> }
        <header className={styles.header}>
          <div className={styles.menu} onClick={toggleDrawer}/>
          {header && <span className={styles.description}>{header}</span>}
        </header>
        <SearchBox />
        <article className={styles.article}>
          <Switch>
            {Object.keys(siteMap).map(path => (
              <Route key={path} path={path} exact={path === "/"} component={pages[path]} />
            ))}
            <Route component={NotFound} />
          </Switch>
        </article>
      </main>
    </div>
  );
};

export default withRouter(App);