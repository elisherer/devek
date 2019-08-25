import React from 'react';
import { CopyToClipboard, ListBox, TextArea, TextBox } from '../_lib';
import { useStore, actions } from './PageData.store';
import * as data from './data';

import styles from './PageData.less';

const options = Object.keys(data.actions);

const PageData = () => {
  const { input, parameters, pickedAction, pipe, selected, output } = useStore();
  const pick = data.actions[pickedAction];

  return (
    <div>
      <p>Enter your data in JSON format to the source text box, pick the actions to process with their required parameters and order and run.</p>
      <span>Source:</span>
      <TextArea autoFocus id="data_input" value={input} onChange={actions.input} />

      <hr />

      <span>Action Picker:</span>
      <div className={styles.picker}>
        <ListBox onChange={actions.pickedAction}
          size={11}
          value={pickedAction}
          options={options} />
        <div className={styles.parameters}>
          <div className={styles.action_title}>
            <button className="emoji" onClick={actions.pipe}>➕</button>
            <div><strong>{pickedAction}</strong> - {pick.description}</div>
          </div>
          {pick.parameters && Object.keys(pick.parameters).map(param => (
            <div key={param}><span>{param}:</span>{Array.isArray(pick.parameters[param]) ? (
             <ListBox options={pick.parameters[param]} size={1} 
                value={parameters[param] || pick.defaults[param]} onChange={actions.parameter} data-name={param}/>
            ) : (
              <TextBox value={parameters[param] || pick.defaults[param]} onChange={actions.parameter} data-name={param} />
            )}</div>
          ))}
        </div>
      </div>

      <span>Actions:</span>
      <div className={styles.actions}>
        <ListBox className={styles.pipe}
            onChange={actions.selectAction}
            size={Math.max(2, pipe.length)}
            value={selected}
            options={pipe} />
        <div className={styles.pipe_actions}>
          <button className="emoji">🔺</button>
          <button className="emoji">🔻</button>
          <button className="emoji" onClick={actions.remove}>❌</button>
        </div>
      </div>

      <button onClick={actions.run}>Run</button>


      <h1>Result</h1>

      <span>Output:</span><CopyToClipboard from="data_output"/>
      <TextArea id="data_output" readOnly lineNumbers value={output} />
    </div>
  );
};

export default PageData;