import { useNavigate } from "react-router";
import styled from "styled-components";

import { CopyToClipboard, TextBox } from "../_lib";
import Now from "./Now";
import { actions, useStore } from "./PageTime.store";
import Stopwatch from "./Stopwatch";
import getHebrewDate from "./hebrew";

const ButtonsWrapper = styled.div`
  margin-bottom: 30px;
`;

const RangeWrapper = styled.label`
  > span {
    margin-right: 20px;
  }
  padding-bottom: 20px;
`;

const pageRoutes = ["now", "convert", "stopwatch"];

const PageTime = ({ location }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  const navigate = useNavigate();
  if (!pageRoutes.includes(type)) {
    navigate("/" + pathSegments[0] + "/" + pageRoutes[0]);
    return;
  }

  const state = useStore();

  if (type === "now") {
    const { ampm } = state;

    return <Now ampm={ampm} />;
  }

  if (type === "stopwatch") {
    return <Stopwatch />;
  }

  // convert

  const { timezone, iso, epoch, parsed, errors } = state;

  const unix = parseInt(parsed.getTime() / 1000),
    rfc = timezone ? parsed.toString() : parsed.toUTCString();

  return (
    <div>
      <ButtonsWrapper>
        <button onClick={actions.now}>Set to Now</button> <button onClick={actions.utc}>Set to UTC</button> / Pick:{" "}
        <input type="date" onChange={actions.iso} />
      </ButtonsWrapper>

      <RangeWrapper>
        <span>Time Zone: ({timezone})</span>
        <input type="range" min="-11" max="14" value={timezone} onChange={actions.timezone} />
      </RangeWrapper>

      <span>ISO 8601:</span>
      <CopyToClipboard from="time_iso" />
      <TextBox invalid={errors.iso} id="time_iso" autoFocus onChange={actions.iso} value={iso} />

      <span>Epoch (ms since):</span>
      <CopyToClipboard from="time_epoch" />
      <TextBox invalid={errors.epoch} id="time_epoch" onChange={actions.epoch} value={epoch} />

      <span>Unix:</span>
      <CopyToClipboard from="time_unix" />
      <TextBox id="time_unix" value={unix} readOnly />

      <span>RFC 2822:</span>
      <CopyToClipboard from="time_rfc" />
      <TextBox id="time_rfc" value={rfc} readOnly />

      <span>Hebrew Calendar:</span>
      <CopyToClipboard from="time_hebrew" />
      <TextBox id="time_hebrew" value={getHebrewDate(parsed)} readOnly />
    </div>
  );
};

export default PageTime;
