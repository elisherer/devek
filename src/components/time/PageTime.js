import { h } from 'hyperapp';
import cc from "classcat";
import Checkbox from '../../lib/Checkbox';
import TextBox from '../../lib/TextBox';
import Tabs from '../../lib/Tabs';
import CopyToClipboard from "../../lib/CopyToClipboard";
import './actions';
import { getWeek } from './time.js';
import styles from './PageTime.less';
import {Link, Redirect} from "@hyperapp/router";

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
  const pathSegments = location.pathname.substr(1).split('/');

  if (pathSegments.length < 2) {
    return <Redirect to={`/${pathSegments[0]}/now`}/>;
  }

  const type = pathSegments[1];


  const tabs = (
    <Tabs>
      <Link data-active={type === 'now'} to={`/${pathSegments[0]}/now`}>Now</Link>
      <Link data-active={type === 'convert'} to={`/${pathSegments[0]}/convert`}>Convert</Link>
    </Tabs>
  );

  if (type === "now") {

    const {ampm} = state.time;

    // update before rendering
    now.setTime(Date.now());

    const week = getWeek(now);
    const utc = now.toUTCString();
    const utcTime = utc.substr(utc.indexOf(':') - 2, 8);
    const local = now.toTimeString().split(' GMT');
    const localTime = ampm ? now.toLocaleTimeString() : local[0];

    return (
      <div>
        <dt oncreate={startTimer} ondestroy={clearTimer}/>
        <div className={styles.float}>
          <Checkbox label="12H" checked={ampm} onchange={actions.time.ampm}/>
        </div>

        {tabs}

        <div className={styles.local_time}>
          <div className={styles.bold}>{localTime}</div>
          <div className={styles.big}>{now.toDateString()}</div>
          <div>Week {week}<br/>GMT{local[1]}</div>
        </div>

        <div className={styles.utc_time}>
          <span className={styles.big}>{utcTime}</span> <span> UTC</span>
        </div>

        <div className={styles.epoch_time}>
          <div className={styles.big}>{now.getTime()}</div>
          <div>Milliseconds since Epoch time</div>
        </div>
      </div>
    );

  }

  // convert

  const { timezone, iso, epoch, parsed, errors } = state.time;

  const unix = parseInt(parsed.getTime() / 1000),
      rfc = timezone ? parsed.toString() : parsed.toUTCString();

  return (
    <div>
      {tabs}

      <div className={styles.buttons}>
        <button onclick={actions.time.now}>Set to Now</button> <button onclick={actions.time.utc}>Set to UTC</button>
      </div>

      <label className={styles.range}>
        <span>Time Zone: ({timezone})</span>
        <input type="range" min="-11" max="14" value={timezone} onchange={actions.time.timezone}/>
      </label>

      <span>ISO 8601:</span><CopyToClipboard from="time_iso"/>
      <TextBox invalid={errors.iso} id="time_iso" autofocus onChange={actions.time.iso} value={iso} />

      <span>Epoch (ms since):</span><CopyToClipboard from="time_epoch"/>
      <TextBox invalid={errors.epoch} id="time_epoch" onChange={actions.time.epoch} value={epoch}/>

      <span>Unix:</span><CopyToClipboard from="time_unix"/>
      <TextBox id="time_unix" value={unix} readonly />

      <span>RFC 2822:</span><CopyToClipboard from="time_unix"/>
      <TextBox id="time_unix" value={rfc} readonly />

    </div>
  );

}