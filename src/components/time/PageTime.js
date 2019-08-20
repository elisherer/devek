import React, {useEffect} from 'react';
import {NavLink, Redirect} from "react-router-dom";
import { Checkbox, CopyToClipboard, Tabs, TextBox } from '../_lib';
import { getWeek } from './time.js';
import { useStore, actions } from './PageTime.store';
import styles from './PageTime.less';
import Clock from './Clock';
import Stopwatch from './Stopwatch';

const now = new Date();

const startTimer = () => {
  let timer = setInterval(actions.refresh, 1000);
  return () => {
    clearTimeout(timer);
  };
};


const PageTime = () => {
  const pathSegments = location.pathname.substr(1).split('/');

  if (pathSegments.length < 2) {
    return <Redirect to={`/${pathSegments[0]}/now`}/>;
  }

  const type = pathSegments[1];

  const tabs = (
    <Tabs>
      <NavLink to={`/${pathSegments[0]}/now`}>Now</NavLink>
      <NavLink to={`/${pathSegments[0]}/convert`}>Convert</NavLink>
      <NavLink to={`/${pathSegments[0]}/stopwatch`}>Stopwatch</NavLink>
    </Tabs>
  );

  useEffect(startTimer, []);

  const state = useStore();

  if (type === "now") {

    const {ampm} = state;

    // update before rendering
    now.setTime(Date.now());

    const week = getWeek(now);
    const utc = now.toUTCString();
    const utcTime = utc.substr(utc.indexOf(':') - 2, 8);
    const local = now.toTimeString().split(' GMT');
    const localTime = ampm ? now.toLocaleTimeString() : local[0];

    return (
      <div>
        <div className={styles.float}>
          <Checkbox label="12H" checked={ampm} onChange={actions.ampm}/>
        </div>

        {tabs}

        <div className={styles.center}>
          <Clock width="240" height="240" />

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

  if (type === "stopwatch") {
    return (
      <div>
        {tabs}
        <Stopwatch />
      </div>
    );
  }

  // convert

  const { timezone, iso, epoch, parsed, errors } = state;

  const unix = parseInt(parsed.getTime() / 1000),
      rfc = timezone ? parsed.toString() : parsed.toUTCString();

  return (
    <div>
      {tabs}

      <div className={styles.buttons}>
        <button onClick={actions.now}>Set to Now</button> <button onClick={actions.utc}>Set to UTC</button>
      </div>

      <label className={styles.range}>
        <span>Time Zone: ({timezone})</span>
        <input type="range" min="-11" max="14" value={timezone} onChange={actions.timezone}/>
      </label>

      <span>ISO 8601:</span><CopyToClipboard from="time_iso"/>
      <TextBox invalid={errors.iso} id="time_iso" autoFocus onChange={actions.iso} value={iso} />

      <span>Epoch (ms since):</span><CopyToClipboard from="time_epoch"/>
      <TextBox invalid={errors.epoch} id="time_epoch" onChange={actions.epoch} value={epoch}/>

      <span>Unix:</span><CopyToClipboard from="time_unix"/>
      <TextBox id="time_unix" value={unix} readOnly />

      <span>RFC 2822:</span><CopyToClipboard from="time_unix"/>
      <TextBox id="time_unix" value={rfc} readOnly />

    </div>
  );
};

export default PageTime;