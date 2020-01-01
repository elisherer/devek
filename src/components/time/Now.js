import React, {useState, useEffect} from 'react';
import Checkbox from '../_lib/Checkbox';
import { getWeek } from './time.js';
import { actions } from './PageTime.store';
import Clock from './Clock';
import getHebrewDate from './hebrew';

import styles from './PageTime.less';

const useRAF = (ampm) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    let id;
    
    function tick() {
      const now = new Date();

      const week = getWeek(now);
      const utc = now.toUTCString();
      const utcTime = utc.substr(utc.indexOf(':') - 2, 8);
      const local = now.toTimeString().split(' GMT');
      const localTime = ampm ? now.toLocaleTimeString() : local[0];
      const localeTimeDateString = now.toDateString();
      const time = now.getTime();
      const hebrewDate = getHebrewDate(now);

      setInfo({
        week, utcTime, tz: local[1], localTime, localeTimeDateString, time, hebrewDate
      });
      id = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(id);
  }, [ampm]);

  return info;
}


const Now = ({ ampm } : { ampm: boolean }) => {

  const {
        week, utcTime, tz, localTime, localeTimeDateString, time, hebrewDate
      } = useRAF(ampm);  

  return (
    <div>
      <div className={styles.float}>
        <Checkbox label="12H" checked={ampm} onChange={actions.ampm}/>
      </div>

      <div className={styles.center}>
        <Clock width="240" height="240" />

        <div className={styles.bold}>{localTime}</div>
        <div className={styles.big}>{localeTimeDateString}</div>
        <div>Week {week}<br/>GMT{tz}</div>
        <div>{hebrewDate}</div>
      </div>

      <div className={styles.utc_time}>
        <span className={styles.big}>{utcTime}</span> <span> UTC</span>
      </div>

      <div className={styles.epoch_time}>
        <div className={styles.big}>{time}</div>
        <div>Milliseconds since Epoch time</div>
      </div>
    </div>
  );
}

export default Now;