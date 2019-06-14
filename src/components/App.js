import React, { useEffect } from 'react';
import { Switch, Route, Link, NavLink, Redirect, withRouter } from 'react-router-dom';
import cx from 'classnames';
import SearchBox from './search/SearchBox';
import NotFound from './NotFound';
import { siteMap } from '../sitemap';
import { useStore, actions } from "./App.store";
import screen from '../helpers/screen';

import styles from './App.less';

const App = ({ location } : { location: Object }) => {
  if (location.pathname === '/' && location.search) {
    return <Redirect to="/" />;
  }

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
        <div className={styles.github} >
          <a href="https://github.com/elisherer/devek" target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg width="28" height="28" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
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

let exportedApp = withRouter(App);

if (process.env.NODE_ENV !== "production") {
  const { hot/*, setConfig*/ }  = require("react-hot-loader/root");
  //setConfig({ logLevel: "debug"});
  exportedApp = hot(exportedApp);
}

export default exportedApp;