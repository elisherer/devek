import {h} from 'hyperapp';
import styles from "./Home.less";

export default () => (
  <div className={styles.page}>
    <img src={require('../assets/devek-logo-black-with-text.min.svg')} />
    <p>Press <code>Alt+S</code>/<code>⌥+S</code> for quick search</p>
  </div>
);