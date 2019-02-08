import { h } from 'hyperapp';
import { Switch, Route, Link } from '@hyperapp/router';
import cc from 'classcat';
import Home from './Home';
import SearchBox from './search/SearchBox';
import NotFound from './NotFound';
import sitemap from '../sitemap';
import pages from '../pages';

import styles from './App.less';

let lastActive = null;

const docTitle = document.querySelector('title');

export default (state, actions) => {
  let header;
  const current = state.location.pathname;

  if (lastActive !== current && current === '/') {
    docTitle.text = 'Devek';
    lastActive = current;
  }

  return (
    <div className={styles.app}>
      <nav className={cc([styles.nav,{ [styles.open]: state.app.drawer }])}>
        <div className={styles.menu} onclick={actions.app.drawer}/>
        {Object.keys(sitemap).map(path => {
          const active = current === path || current.startsWith(path + '/');
          if (active) {
            header = sitemap[path].header;
            if (lastActive !== path) {
              docTitle.text = path === "/" ? 'Devek' : `Devek - ${header}`;
              lastActive = path;
            }
          }

          return path === '/' ? (
            <Link to="/" className={styles.logo}/>
          ) : (
            <Link key={path} to={path}
                  className={cc({ [styles.menuitem]: true, [styles.active]: active })}>
              {sitemap[path].title}
            </Link>
          );
        })}
        <p>Alt+S for search</p>
      </nav>
      <main className={styles.main}>
        {state.app.drawer && <div className={styles.overlay} onclick={actions.app.drawer} /> }
        <header className={styles.header}>
          <div className={styles.menu} onclick={actions.app.drawer}/>
          {header && <span className={styles.description}>{header}</span>}
        </header>
        <SearchBox />
        <article className={styles.article}>
          <Switch>
            {Object.keys(sitemap).map(path => (
              <Route path={path} parent={path !== "/"} render={pages[sitemap[path].name]} />
            ))}
            <Route render={NotFound} />
          </Switch>
        </article>
      </main>
    </div>
  );
}