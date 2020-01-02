import React, { Fragment, Suspense, useEffect } from 'react';
import { Switch, Route, Link, NavLink, Redirect, useLocation } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiGithubCircle, mdiMenu } from '@mdi/js';
import SearchBox from './search/SearchBox';
import NotFound from './NotFound';
import { siteMap } from '../sitemap';
import { useStore, actions } from './App.store';
import screen from 'helpers/screen';
import { Spinner, Tabs} from './_lib';

import styles from './App.less';

const devekSearch = () => window.devek.openSearch();

const App = () => {
  const location = useLocation();
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
      <Fragment key={path}>
        <Link to="/" aria-label="Homepage"/>
        <div className={styles.search_hint}>Press <kbd onClick={devekSearch}>/</kbd> to search</div>
      </Fragment>
    ) : (
      <NavLink key={path} to={path} className={styles.navitem} activeClassName={styles.active} aria-label={siteMap[path].title}>
        {!!siteMap[path].icon && (
          <Icon path={siteMap[path].icon} size={1}/>
        )}
        {siteMap[path].title}
      </NavLink>
    );
  });

  // locate parent on siteMap
  const parentPath = '/' + location.pathname.split('/')[1];
  const siteMapParent = siteMap[parentPath];

  // location change
  useEffect(() => {
    document.title = header && location.pathname !== "/" ? `Devek - ${header}` : 'Devek';
    if (!screen.isDesktop) {
      actions.drawerClose();
    }
  }, [location.pathname]);

  return (
    <>
      <nav className={state.drawer ? styles.open : undefined}>
        <div className={styles.menu} onClick={actions.drawerClose}>
          <Icon path={mdiMenu} size={1.5} color="white"/>
        </div>
        <div className={styles.github} >
          <a href="https://github.com/elisherer/devek" target="_blank" rel="noopener noreferrer" title="GitHub">
            <Icon path={mdiGithubCircle} size={1.33} />
          </a>
        </div>
        {navLinks}
      </nav>
      <main>
        {state.drawer && <div className={styles.overlay} onClick={actions.drawerClose} /> }
        <SearchBox />
        <header>
          <div className={styles.menu} onClick={actions.drawerOpen}>
            <Icon path={mdiMenu} size={1.5} />
          </div>
          <h1>{siteMapParent.icon && <Icon path={siteMapParent.icon} size={1.33} />} {siteMapParent.header}</h1>
          {siteMapParent && siteMapParent.children && (
          <Tabs className={styles.tabs}>
            {Object.keys(siteMapParent.children).map(path => 
              <NavLink key={path} to={parentPath + path} exact={path === '/' || path === ''}>{siteMapParent.children[path].title}</NavLink>
            )}
          </Tabs>
          )}
        </header>       
        <Suspense fallback={<Spinner />}>
          <article>
            <Switch>
              {Object.keys(siteMap).map(path => (
                <Route key={path} path={path} exact={path === "/"} component={siteMap[path].component}/>
              ))}
              <Route component={NotFound}/>
            </Switch>
          </article>
        </Suspense>
      </main>
    </>
  );
};

let exportedApp = App;

if (process.env.NODE_ENV !== "production") {
  const { hot/*, setConfig*/ }  = require("react-hot-loader/root");
  //setConfig({ logLevel: "debug"});
  exportedApp = hot(exportedApp);
}

export default exportedApp;