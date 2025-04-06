import { useState, useEffect } from "react";
import styled from "styled-components";

const ButtonsWrapper = styled.div`
  margin-bottom: 30px;
`;
const Center = styled.div`
  text-align: center;
`;
const StopwatchTime = styled.div`
  font-size: 3em;
  margin-bottom: 20px;
`;

var pad = (n, z = 2) => ("00" + n).slice(-z);
function formatTime(time) {
  const s = Math.round(time);
  return (
    pad((s / 3.6e6) | 0) +
    ":" +
    pad(((s % 3.6e6) / 6e4) | 0) +
    ":" +
    pad(((s % 6e4) / 1000) | 0) +
    "." +
    pad(s % 1000, 3)
  );
}

function useFrameNow(isActive) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (!isActive) return;

    let id;

    function updateNow() {
      setNow(performance.now());
    }

    function tick() {
      if (!isActive) return;
      updateNow();
      id = requestAnimationFrame(tick);
    }

    updateNow();
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  return isActive ? now : null;
}

const Stopwatch = () => {
  const [pastLapse, setPastLapse] = useState(0);
  const [laps, setLaps] = useState([]);
  const [startTime, setStartTime] = useState(null);

  const isRunning = startTime !== null;
  const frameNow = useFrameNow(isRunning);
  const currentLapse = isRunning ? Math.max(0, frameNow - startTime) : 0;
  const totalLapse = pastLapse + currentLapse;

  function handleRunClick() {
    if (isRunning) {
      setPastLapse(l => l + performance.now() - startTime);
      setStartTime(null);
    } else {
      setStartTime(performance.now());
    }
  }

  function handleClearClick() {
    setPastLapse(0);
    setStartTime(null);
    setLaps([]);
  }

  function handleLap() {
    setLaps([...laps, formatTime(totalLapse)]);
  }

  return (
    <Center>
      <StopwatchTime>{formatTime(totalLapse)}</StopwatchTime>

      <ButtonsWrapper>
        <button onClick={handleRunClick}>{isRunning ? "Stop" : "Start"}</button>{" "}
        <button onClick={handleLap} disabled={!isRunning}>
          Lap
        </button>
      </ButtonsWrapper>
      <button onClick={handleClearClick}>Clear</button>
      {!!laps.length && (
        <>
          <hr />
          <ol>
            {laps.map((lap, i) => (
              <li key={i}>{lap}</li>
            ))}
          </ol>
        </>
      )}
    </Center>
  );
};

export default Stopwatch;
