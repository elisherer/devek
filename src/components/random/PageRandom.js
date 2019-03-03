import { h } from 'hyperapp';
import TextArea from '../TextArea';
import CopyToClipboard from '../CopyToClipboard';
import Radio from "../Radio";
import Tabs from "../Tabs";
import { getFlags, getSize, getCount } from './actions';
import {generatePassword, generateTable, uuidv4} from "./rand";
import {Link, Redirect} from "@hyperapp/router";

import styles from './PageRandom.less';

let table = null, tableFlags = null;

export default () => (state, actions) => {
  const pathSegments = location.pathname.substr(1).split('/');

  if (pathSegments.length < 2) {
    return <Redirect to={`/${pathSegments[0]}/password`}/>;
  }

  const type = pathSegments[1];

  let result, flags, size;

  const count = getCount(state);

  if (type === "password") {
    flags = getFlags(state);
    size = getSize(state);
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


  return (
    <div>
      <Tabs>
        <Link data-active={pathSegments[1] === 'password'} to="/random/password">Password</Link>
        <Link data-active={pathSegments[1] === 'guid'} to="/random/guid">Guid</Link>
      </Tabs>

      <label className={styles.range}>
        <span>Count ({count})</span>
        <input type="range" min="1" max="16" value={count} onchange={actions.random.count}/>
      </label>

      {type === "password" && (
        <div>
          <label className={styles.range}>
            <span>Length ({size})</span>
            <input type="range" min="6" max="64" value={size} onchange={actions.random.size} />
          </label>

          <label>Flags</label>
          <Radio className={styles.flags}>
            <div data-active={flags.includes('a')} data-flag="a" onclick={actions.random.flags}>a-z</div>
            <div data-active={flags.includes('A')} data-flag="A" onclick={actions.random.flags}>A-Z</div>
            <div data-active={flags.includes('0')} data-flag="0" onclick={actions.random.flags}>0-9</div>
            <div data-active={flags.includes('!')} data-flag="!" onclick={actions.random.flags}>!@#...</div>
            <div data-active={flags.includes('O')} data-flag="O" onclick={actions.random.flags}>1lIioO0</div>
          </Radio>
        </div>
      )}

      <div className={styles.buttons}>
        <button onclick={actions.app.refresh}>Regenerate</button>
      </div>

      <h1>Result</h1>
      <CopyToClipboard from="random_result" />
      <TextArea id="random_result" readonly value={result} />

    </div>
  );
}