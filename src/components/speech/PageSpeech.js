import { useCallback, useMemo, useEffect, useState } from "react";
import { TextArea, ListBox } from "../_lib";
import { useStore, actions } from "./PageSpeech.store";
import { recordSpeech, speak, synth } from "./speech";
import styled from "styled-components";

import { mdiPlay, mdiPause, mdiStop, mdiRecord, mdiUndo } from "@mdi/js";
import Icon from "@mdi/react";
import { supportedAudios } from "./record";

const RangeWrapper = styled.label`
  display: flex !important;
  margin-bottom: 20px !important;
  span {
    display: inline-block;
    width: 90px;
  }
  input[type="range"] {
    flex: 1;
  }
`;

const pause = () => {
  if (!synth.paused) {
    synth.pause();
  }
  actions.pause();
};

const stop = () => {
  if (synth.speaking || synth.pending) {
    synth.cancel();
  }
  actions.stop();
};

const resume = () => {
  if (synth.paused) {
    synth.resume();
  }
  actions.resume();
};

const PageSpeech = () => {
  const { input, pitch, rate, voices, voice, speaking, paused } = useStore();
  const [recordedBlobUrl, setRecordedBlobUrl] = useState("");
  const [mimeType, setMimeType] = useState("audio/mp4");

  useEffect(() => {
    actions.voices();
    synth.addEventListener("voiceschanged", actions.voices);
    return () => synth.removeEventListener("voiceschanged", actions.voices);
  }, []);

  const play = useCallback(() => {
    speak({
      input,
      pitch,
      rate,
      voice: voices.find(v => v.name === voice)
    }).then(() => {
      actions.stop();
    });
    actions.speak();
  }, [input, pitch, rate, voices, voice]);

  const voicesList = useMemo(() => {
    return voices.map(voice => ({
      value: voice.name,
      name: `${voice.name} (${voice.lang})${voice.default ? " *" : ""}`
    }));
  }, [voices]);

  const record = () => {
    setRecordedBlobUrl("");
    recordSpeech(
      {
        input,
        pitch,
        rate,
        voice: voices.find(v => v.name === voice)
      },
      mimeType
    ).then(url => {
      setRecordedBlobUrl(url);
      actions.stop();
    });
    actions.speak();
  };

  return (
    <div>
      <h1>Synthesis</h1>

      <label>
        Text to speak:
        <TextArea
          disabled={speaking}
          autoFocus
          selectOnFocus
          value={input}
          onChange={actions.input}
        />
      </label>

      <label>
        Voice:
        <ListBox
          disabled={speaking}
          size={1}
          options={voicesList}
          value={voice}
          onChange={actions.voice}
        />
      </label>

      <div style={{ position: "relative" }}>
        <RangeWrapper>
          <span>Pitch ({pitch})</span>
          <input
            disabled={speaking}
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={actions.pitch}
          />
        </RangeWrapper>

        <RangeWrapper>
          <span>Rate ({rate})</span>
          <input
            disabled={speaking}
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={actions.rate}
          />
        </RangeWrapper>
        <button
          style={{ position: "absolute", top: 0, right: 0 }}
          className="icon"
          onClick={actions.reset}
          disabled={(rate === 1) & (pitch === 1)}
        >
          <Icon path={mdiUndo} />
        </button>
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        <button className="icon" onClick={speaking ? resume : play} disabled={speaking && !paused}>
          <Icon path={mdiPlay} />
        </button>
        <button className="icon" onClick={pause} disabled={!speaking || paused}>
          <Icon path={mdiPause} />
        </button>
        <button className="icon" onClick={stop} disabled={!speaking}>
          <Icon path={mdiStop} />
        </button>
      </div>

      <br />
      <h4>Record</h4>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button className="icon" onClick={record} disabled={speaking}>
          <Icon path={mdiRecord} />
        </button>
        <div>
          <label>Select a mime-type (output format):</label>
          <ListBox
            size={1}
            value={mimeType}
            onChange={e => setMimeType(e.target.value)}
            options={supportedAudios}
          />
        </div>
      </div>
      {recordedBlobUrl && (
        <>
          <br />
          <audio controls src={recordedBlobUrl}></audio>
        </>
      )}
    </div>
  );
};

export default PageSpeech;
