import { h } from 'hyperapp';
import { Switch, Route, Link } from '@hyperapp/router';
import cc from 'classcat';
import SearchBox from './search/SearchBox';
import NotFound from './NotFound';
import { siteMap } from '../sitemap';
import pages from '../pages';
import styles from './App.less';

const appName = 'Devek';
let lastActive = null;

const docTitle = document.querySelector('title');

export default (state, actions) => {
  let header;
  const current = state.location.pathname;

  if (lastActive !== current && current === '/') {
    docTitle.text = appName;
    lastActive = current;
  }

  return (
    <div className={styles.app}>
      <nav className={cc([styles.nav,{ [styles.open]: state.app.drawer }])}>
      <div className={styles.menu} onclick={actions.app.drawer}/>
        {Object.keys(siteMap).map(path => {
          const active = current === path || current.startsWith(path + '/');
          if (active) {
            header = siteMap[path].header;
            if (lastActive !== path) {
              docTitle.text = path === "/" ? appName : `${appName} - ${header}`;
              lastActive = path;
            }
          }

          return path === '/' ? [
            <Link to="/" className={styles.logo}/>,
            <div className={styles.search_hint}>Press <kbd>/</kbd> to search</div>
          ] : (
            <Link key={path} to={path}
                  className={cc({ [styles.menuitem]: true, [styles.active]: active })}>
              {siteMap[path].title}
            </Link>
          );
        })}
      </nav>
      <main className={styles.main}>
        {state.app.drawer && <div className={styles.overlay} onclick={actions.app.drawer} /> }
        <header className={styles.header}>
          <div className={styles.menu} onclick={actions.app.drawer}/>
          {header && <span className={styles.description}>{header}</span>}
        </header>
        <SearchBox />
        <article className={styles.article} key={current /* force re-rendering of page */}>
          <Switch>
            {Object.keys(siteMap).map(path => (
              <Route path={path} parent={path !== "/"} render={pages[path]} />
            ))}
            <Route render={NotFound} />
          </Switch>
        </article>
      </main>
    </div>
  );
}