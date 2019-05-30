import React from 'react';
import {NavLink, Redirect} from "react-router-dom";
import TextArea from '../../lib/TextArea';
import CopyToClipboard from '../../lib/CopyToClipboard';
import Radio from "../../lib/Radio";
import Tabs from "../../lib/Tabs";
import { useStore, actions } from './actions';
import {generatePassword, generateTable, uuidv4} from "./rand";

import styles from './PageRandom.less';

let table = null, tableFlags = null;
let ticks = null;

const PageRandom = () => {
  const pathSegments = location.pathname.substr(1).split('/');

  if (pathSegments.length < 2) {
    return <Redirect to={`/${pathSegments[0]}/password`}/>;
  }

  const type = pathSegments[1];

  let result, flags, size;
  const state = useStore('random');
  const {
    count,
  } = state;

  if (type === "password") {
    flags = state.flags;
    size = state.size;
    const results = [];

    if (tableFlags !== flags) {
      table = generateTable(flags);
    }
    for (let i = 0; i < count ; i++)
      results.push(generatePassword(size, table));
    result = results.join('\n');
  }
  else if (type === "guid") {
    const results = [];
    for (let i = 0; i < count ; i++)
      results.push(uuidv4());
    result = results.join('\n');
  } else {
    result = "N/A";
  }

  if (!ticks) {
    const opts = [];
    for (let i = 6; i < 65; i++) {
      opts.push(<option key={i}>{i}</option>);
    }
    ticks = (
      <datalist id="random_password_size">{opts}</datalist>
    );
  }

  return (
    <div>
      <Tabs>
        <NavLink to="/random/password">Password</NavLink>
        <NavLink to="/random/guid">Guid</NavLink>
      </Tabs>

      <label className={styles.range}>
        <span>Count ({count})</span>
        <input type="range" min="1" max="16" value={count} onChange={actions.count}/>
      </label>

      {type === "password" && (
        <div>
          <label className={styles.range}>
            <span>Length ({size})</span>
            <input type="range" min="6" max="64" step="1" list="random_password_size" value={size} onChange={actions.size} />
            {ticks}
          </label>

          <label>Flags</label>
          <Radio className={styles.flags}>
            <div data-active={flags.includes('a')||null} data-flag="a" onClick={actions.flags}>a-z</div>
            <div data-active={flags.includes('A')||null} data-flag="A" onClick={actions.flags}>A-Z</div>
            <div data-active={flags.includes('0')||null} data-flag="0" onClick={actions.flags}>0-9</div>
            <div data-active={flags.includes('!')||null} data-flag="!" onClick={actions.flags}>!@#...</div>
            <div data-active={flags.includes('O')||null} data-flag="O" onClick={actions.flags}>1lIioO0</div>
          </Radio>
        </div>
      )}

      <div className={styles.buttons}>
        <button onClick={actions.refresh}>Regenerate</button>
      </div>

      <h1>Result</h1>
      <CopyToClipboard from="random_result" />
      <TextArea id="random_result" readOnly value={result} />

    </div>
  );
};

export default PageRandom;