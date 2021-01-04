import { Redirect } from "react-router-dom";
import { CopyToClipboard, TextBox } from "../_lib";
import { useStore, actions } from "./PageTime.store";
import Now from "./Now";
import Stopwatch from "./Stopwatch";
import styled from "styled-components";

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

const PageTime = ({ location }: { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  if (!pageRoutes.includes(type)) {
    return <Redirect to={"/" + pathSegments[0] + "/" + pageRoutes[0]} />;
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
        <button onClick={actions.now}>Set to Now</button>{" "}
        <button onClick={actions.utc}>Set to UTC</button> / Pick:{" "}
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
      <CopyToClipboard from="time_unix" />
      <TextBox id="time_unix" value={rfc} readOnly />
    </div>
  );
};

export default PageTime;
