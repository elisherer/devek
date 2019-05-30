import React, { useEffect } from 'react';
import { Switch, Route, Link, NavLink, withRouter } from 'react-router-dom';
import cx from 'classnames';
import SearchBox from './search/SearchBox';
import NotFound from './NotFound';
import { siteMap } from '../sitemap';
import { useStore, actions } from "./App.store";
import screen from '../helpers/screen';

import styles from './App.less';

const App = ({ location } : { location: Object }) => {
  const state = useStore();

  let header = null;
  const navLinks = Object.keys(siteMap).map(path => {
    const active = location.pathname === path || location.pathname.startsWith(path + '/');
    if (active) {
      header = siteMap[path].header;
    }

    return path === '/' ? (
      <React.Fragment key={path}>
        <Link to="/" className={styles.logo}/>
        <div className={styles.search_hint}>Press <kbd>/</kbd> to search</div>
      </React.Fragment>
    ) : (
      <NavLink key={path} to={path} className={styles.menuitem} activeClassName={styles.active}>
        {siteMap[path].title}
      </NavLink>
    );
  });

  // location change
  useEffect(() => {
    document.title = header && location.pathname !== "/" ? `Devek - ${header}` : 'Devek';
    if (!screen.isDesktop) {
      actions.drawerClose();
    }
  }, [location.pathname]);

  return (
    <div className={styles.app}>
      <nav className={cx(styles.nav,{ [styles.open]: state.drawer })}>
        <div className={styles.menu} onClick={actions.drawerClose}/>
        {navLinks}
      </nav>
      <main className={styles.main}>
        {state.drawer && <div className={styles.overlay} onClick={actions.drawerClose} /> }
        <header className={styles.header}>
          <div className={styles.menu} onClick={actions.drawerOpen}/>
          {header && <span className={styles.description}>{header}</span>}
        </header>
        <SearchBox />
        <article className={styles.article}>
          <Switch>
            {Object.keys(siteMap).map(path => (
              <Route key={path} path={path} exact={path === "/"} component={siteMap[path].component} />
            ))}
            <Route component={NotFound} />
          </Switch>
        </article>
      </main>
    </div>
  );
};

export default withRouter(App);