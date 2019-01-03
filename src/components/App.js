import { h } from 'hyperapp';
import { Switch, Route, Link } from '@hyperapp/router';
import SideNav from './SideNav';
import Home from './Home';
import PageText from './PageText';
import NotFound from './NotFound';
import styles from './App.less';

export default () => (state, actions) => {

  return (
    <div>
      <header className={styles.header}>
        <Link to="/">Devek</Link> Developer Toolkit
      </header>
      <SideNav />
      <main>
        <Switch>
          <Route path="/" render={Home} />
          <Route path="/text" parent render={PageText} />
          <Route render={NotFound} />
        </Switch>
      </main>
    </div>
  );
}