import { useState, useEffect } from "react";
import Checkbox from "../_lib/Checkbox";
import { getWeek } from "./time.js";
import { actions } from "./PageTime.store";
import Clock from "./Clock";
import getHebrewDate from "./hebrew";
import styled from "styled-components";

const NowWrapper = styled.div`
  .float {
    position: absolute;
    top: 60px;
    right: 30px;
  }
  .center {
    text-align: center;
  }
  .big {
    font-size: 28px;
  }
  .bold {
    font-size: 30px;
    font-weight: bolder;
  }
`;
const UTCTime = styled.div`
  padding: 20px;
  text-align: center;
`;
const EpochTime = styled.div`
  text-align: center;
`;

const useRAF = ampm => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    let id;

    function tick() {
      const now = new Date();

      const week = getWeek(now);
      const utc = now.toUTCString();
      const utcTime = utc.substr(utc.indexOf(":") - 2, 8);
      const local = now.toTimeString().split(" GMT");
      const localTime = ampm ? now.toLocaleTimeString() : local[0];
      const localeTimeDateString = now.toDateString();
      const time = now.getTime();
      const hebrewDate = getHebrewDate(now);

      setInfo({
        week,
        utcTime,
        tz: local[1],
        localTime,
        localeTimeDateString,
        time,
        hebrewDate
      });
      id = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(id);
  }, [ampm]);

  return info;
};

const Now = ({ ampm }: { ampm: boolean }) => {
  const { week, utcTime, tz, localTime, localeTimeDateString, time, hebrewDate } = useRAF(ampm);

  return (
    <NowWrapper>
      <div className="float">
        <Checkbox label="12H" checked={ampm} onChange={actions.ampm} />
      </div>

      <div className="center">
        <Clock width="240" height="240" />

        <div className="bold">{localTime}</div>
        <div className="big">{localeTimeDateString}</div>
        <div>
          Week {week}
          <br />
          GMT{tz}
        </div>
        <div>{hebrewDate}</div>
      </div>

      <UTCTime>
        <span className="big">{utcTime}</span> <span> UTC</span>
      </UTCTime>

      <EpochTime>
        <div className="big">{time}</div>
        <div>Milliseconds since Epoch time</div>
      </EpochTime>
    </NowWrapper>
  );
};

export default Now;
