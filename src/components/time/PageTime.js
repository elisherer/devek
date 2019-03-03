import { h } from 'hyperapp';
import Checkbox from '../Checkbox';
import './actions';
import styles from './PageTime.less';

const now = new Date();
let boundRefreshAction;
let timer;
const startTimer = () => {
  timer = setInterval(boundRefreshAction, 1000);
};
const clearTimer = () => {
  clearTimeout(timer);
};

export default () => (state, actions) => {
  if (!boundRefreshAction) {
    boundRefreshAction = actions.app.refresh; // initialize
  }

  const { ampm } = state.time;

  // update before rendering
  now.setTime(Date.now());

  const utc = now.toUTCString();
  const utcTime = utc.substr(utc.indexOf(':') - 2, 8);
  const local = now.toTimeString().split(' GMT');
  const localTime = ampm ? now.toLocaleTimeString() : local[0];

  return (
    <div>
      <h1>Local: GMT{local[1]}</h1>
      <div className={styles.float}>
        <Checkbox label="12H" checked={ampm} onchange={actions.time.ampm} />
      </div>
      <div className={styles.bold}>{localTime}</div>
      <div className={styles.big}>{now.toDateString()}</div>
      <h1>UTC:</h1>
      <div className={styles.bold}>{utcTime}</div>
      <h1>Timestamp:</h1>
      Milliseconds since Epoch time:
      <div className={styles.bold}>{now.getTime()}</div>
      <dt oncreate={startTimer} ondestroy={clearTimer}/>
    </div>
  );
}