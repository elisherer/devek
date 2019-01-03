import { h } from 'hyperapp';
import { Link } from '@hyperapp/router';
import styles from './SideNav.less';

const tools = {
  TEXT: { icon: 'a', href: '/text'},
  JWT: { icon: 'j', href: '/jwt'},
  JSON: { icon: 's', href: '/json'},
  XML: { icon: 'x', href: '/xml'}
};

export default (state, actions) => (
  <nav className={styles.nav}>
     {Object.keys(tools).map(toolKey => {
       const current = window.location.pathname,
         href = tools[toolKey].href;
       const active = current === href || current.startsWith(href + '/');
        return (
          <Link key={toolKey}
            className={styles.menu_item + (active ? ' ' + styles.active : '')}
            to={tools[toolKey].href}>
            {toolKey}
          </Link>
          );
      })}
    </nav>
);