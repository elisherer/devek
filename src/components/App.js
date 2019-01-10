import { h } from 'hyperapp';
import { Switch, Route, Link } from '@hyperapp/router';
import cc from 'classcat';
import Home from './Home';
import NotFound from './NotFound';
import tools from '../tools';

import styles from './App.less';


export default (state, actions) => {

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link to="/">Devek</Link> Developer Toolkit
      </header>
      <main className={styles.main}>
        <nav className={styles.nav}>
          {Object.keys(tools).map(a => {
            const current = state.location.pathname,
              href = '/' + a;
            const active = current === href || current.startsWith(href + '/');
            return (
              <Link key={a}
                    className={cc({ [styles.active]: active })}
                    to={href}>
                {tools[a].title}
              </Link>
            );
          })}
        </nav>
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