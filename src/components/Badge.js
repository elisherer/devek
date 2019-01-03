import { h } from 'hyperapp';
import styles from './Badge.less';

export default ({ active, ...rest },children) => (
  <div className={styles.badge + (active ? ' ' + styles.active : '')}
       {...rest}>{children}</div>
)