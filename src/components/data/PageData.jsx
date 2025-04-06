import { useEffect, useCallback, useMemo } from "react";
import { ChecklistBox, CopyToClipboard, ListBox, TextArea, TextBox } from "../_lib";
import { useStore, actions } from "./PageData.store";
import * as data from "./data";
import {
  mdiPlus,
  mdiChevronUp,
  mdiChevronDown,
  mdiDelete,
  mdiSync,
  mdiImport,
  mdiExport
} from "@mdi/js";
import Icon from "@mdi/react";
import Worker from "./data.worker";
import styled from "styled-components";

const options = Object.keys(data.actions);
const stringify = obj =>
  Object.keys(obj).reduce((a, c) => a + (a ? ", " : "") + c + "=" + obj[c], "");

const Picker = styled.div`
  display: flex;
  section {
    flex: 0.5;
  }
`;

const Parameters = styled.div`
  flex: 1;
  padding-left: 8px;
  div:first-child {
    margin-bottom: 10px;
  }
`;
const PickerActions = styled.div`
  button {
    margin-right: 8px;
  }
`;
const PipeActionsListBox = styled(ListBox)`
  max-width: 100%;
  option {
    font-family: ${({ theme }) => theme.fontMono};
  }
`;
const Timestamp = styled.span`
  float: right;
  color: ${({ theme }) => theme.greyBorder};
`;

const PageData = () => {
  const {
    input,
    parameters,
    pickedAction,
    pipe,
    selected,
    running,
    output,
    timestamp
  } = useStore();
  const pick = data.actions[pickedAction];

  const worker = useMemo(() => {
    // create worker on first render
    const w = new Worker();
    w.addEventListener("message", event => {
      // receive message from worker
      actions.runFinished(event.data.result);
    });
    return w;
  }, []);
  useEffect(
    () => () => {
      // terminate on unmount
      worker.terminate();
    },
    []
  );

  const runStart = useCallback(() => {
    actions.runStart(); // set running flag
    // post to worker
    worker.postMessage({ input, pipe });
  }, [input, pipe]);

  const handleImport = useCallback(() => {
    const promptInput = window.prompt("Paste the import data");
    try {
      const importData = JSON.parse(promptInput);
      if (!importData) return;
      if (!Array.isArray(importData)) throw new Error("JSON is not an array");
      if (
        importData.some(
          x => !data.actions[x.action] || (data.actions[x.action].parameters && !x.parameters)
        )
      )
        throw new Error("Array contains invalid action structures");
      //TODO: validate more
      actions.import(importData);
    } catch (e) {
      window.alert(e.message);
    }
  }, []);
  const handleExport = useCallback(() => {
    window.prompt("Copy the export data", JSON.stringify(pipe));
  }, [pipe]);
  const pipeMemo = useMemo(
    () =>
      pipe.map(x => ({
        value: x.value,
        name: `${x.action}(${x.parameters ? stringify(x.parameters) : ""})`
      })),
    [pipe]
  );

  return (
    <div>
      <p>
        Enter your data in raw format to the source text box, pick the actions to process with their
        required parameters, order and run.
      </p>
      <span>Source:</span>
      <TextArea autoFocus id="data_input" value={input} onChange={actions.input} />

      <hr />

      <span>Action Picker:</span>
      <Picker>
        <ListBox onChange={actions.pickedAction} size={11} value={pickedAction} options={options} />
        <Parameters>
          <div>
            <strong>{pickedAction}</strong> - {pick.description}
          </div>
          {pick.parameters &&
            Object.keys(pick.parameters).map(param => (
              <div key={param}>
                <span>{param}:</span>
                {Array.isArray(pick.parameters[param]) ? (
                  Array.isArray(pick.defaults[param]) ? (
                    <ChecklistBox
                      label={param}
                      options={pick.parameters[param]}
                      value={parameters[param] || pick.defaults[param]}
                      onChange={actions.parameter}
                      maxShowSelection={Infinity}
                      data-name={param}
                    />
                  ) : (
                    <ListBox
                      options={pick.parameters[param]}
                      size={1}
                      value={parameters[param] || pick.defaults[param]}
                      onChange={actions.parameter}
                      data-name={param}
                    />
                  )
                ) : (
                  <TextBox
                    value={parameters[param] || pick.defaults[param]}
                    onChange={actions.parameter}
                    data-name={param}
                  />
                )}
              </div>
            ))}
        </Parameters>
      </Picker>
      <PickerActions>
        <button className="tool" onClick={actions.pipe} title="Add command">
          <Icon path={mdiPlus} size={1} />
        </button>
        <button className="tool" disabled={!pipe.length} onClick={actions.update} title="Update">
          <Icon path={mdiSync} size={1} />
        </button>
        <button
          className="tool"
          disabled={!pipe.length || selected === 0}
          onClick={actions.moveUp}
          title="Move up"
        >
          <Icon path={mdiChevronUp} size={1} />
        </button>
        <button
          className="tool"
          disabled={!pipe.length || selected === pipe.length - 1}
          onClick={actions.moveDown}
          title="Move down"
        >
          <Icon path={mdiChevronDown} size={1} />
        </button>
        <button className="tool" disabled={!pipe.length} onClick={actions.remove} title="Remove">
          <Icon path={mdiDelete} size={1} />
        </button>
        <button className="tool" onClick={handleImport} title="Import">
          <Icon path={mdiImport} size={1} />
        </button>
        <button className="tool" disabled={!pipe.length} onClick={handleExport} title="Remove">
          <Icon path={mdiExport} size={1} />
        </button>
      </PickerActions>
      <span>Actions:</span>
      <PipeActionsListBox
        onChange={actions.selectAction}
        size={Math.max(6, pipe.length)}
        value={selected}
        options={pipeMemo}
        numbered
        indexed
      />

      <button onClick={runStart} disabled={!pipe.length || running}>
        {running ? "Running..." : "Run"}
      </button>

      {output && (
        <>
          <h1>Result</h1>
          <span>Output:</span>
          <CopyToClipboard from="data_output" /> <Timestamp>{timestamp.toISOString()}</Timestamp>
          <TextArea id="data_output" readOnly lineNumbers value={output} />
        </>
      )}
    </div>
  );
};

export default PageData;
