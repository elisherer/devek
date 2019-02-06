import { h } from 'hyperapp';
import { Switch, Route, Link } from '@hyperapp/router';
import cc from 'classcat';
import Home from './Home';
import NotFound from './NotFound';
import sitemap from '../sitemap';
import pages from '../pages';

import styles from './App.less';

let lastActive = null;

export default (state, actions) => {
  let header;
  const current = state.location.pathname;

  return (
    <div className={styles.app}>
      <nav className={cc([styles.nav,{ [styles.open]: state.app.drawer }])}>
        <div className={styles.menu} onclick={actions.app.drawer}/>
        <Link to="/" className={styles.logo}/>
        {Object.keys(sitemap).map(path => {
          const active = current === path || current.startsWith(path + '/');
          if (active) {
            header = sitemap[path].header;
            if (lastActive !== path) {
              document.querySelector('title').text = `Devek - ${header}`;
              lastActive = path;
            }
          }
          return (
            <Link key={path} to={path}
                  className={cc({ [styles.menuitem]: true, [styles.active]: active })}>
              {sitemap[path].title}
            </Link>
          );
        })}
      </nav>
      <main className={styles.main}>
        {state.app.drawer && <div className={styles.overlay} onclick={actions.app.drawer} /> }
        <header className={styles.header}>
          {header && <span className={styles.description}>{header}</span>}
        </header>
        <div className={styles.menu} onclick={actions.app.drawer}/>
        <article className={styles.article}>
          <Switch>
            <Route path="/" render={Home} />
            {Object.keys(sitemap).map(path => (
              <Route path={path} parent render={pages[sitemap[path].name]} />
            ))}
            <Route render={NotFound} />
          </Switch>
        </article>
      </main>
    </div>
  );
}