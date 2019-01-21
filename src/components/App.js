import { h } from 'hyperapp';
import { Switch, Route, Link } from '@hyperapp/router';
import cc from 'classcat';
import Home from './Home';
import NotFound from './NotFound';
import tools from '../tools';

import styles from './App.less';


export default (state, actions) => {
  let header;
  return (
    <div className={styles.app}>
      <nav className={cc([styles.nav,{ [styles.open]: state.app.drawer }])}>
        <div className={styles.menu} onclick={actions.app.drawer}/>
        <Link to="/" className={styles.logo}/>
        {Object.keys(tools).map(a => {
          const current = state.location.pathname,
            href = '/' + a;
          const active = current === href || current.startsWith(href + '/');
          if (active) header = tools[a].header;
          return (
            <Link key={a}
                  className={cc({ [styles.menuitem]: true, [styles.active]: active })}
                  to={href}>
              {tools[a].title}
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
            {Object.keys(tools).map(a => (
              <Route path={'/' + a} parent render={tools[a].component} />
            ))}
            <Route render={NotFound} />
          </Switch>
        </article>
      </main>
    </div>
  );
}