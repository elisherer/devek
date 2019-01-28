import { h } from 'hyperapp';
import Card from '../Card';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import CopyToClipboard from '../CopyToClipboard';
import Radio from "../Radio";
import { getFlags, getSize } from 'actions/random';
import {generatePassword, generateTable,} from "./rand";
import styles from './PageRandom.less';

let table = null, tableFlags = null;

export default () => (state, actions) => {

  const flags = getFlags(state),
    size = getSize(state);

  if (tableFlags !== flags) {
    table = generateTable(flags);
  }

  let result = generatePassword(size, table);

  return (
    <div className={styles.page}>
      <Card>
        <label>Length</label>
        <input type="range" min="6" max="64" value={size} onchange={actions.random.size} />

        <label>Flags</label>
        <Radio className={styles.flags}>
          <div data-active={flags.includes('a')} data-flag="a" onclick={actions.random.flags}>a-z</div>
          <div data-active={flags.includes('A')} data-flag="A" onclick={actions.random.flags}>A-Z</div>
          <div data-active={flags.includes('0')} data-flag="0" onclick={actions.random.flags}>0-9</div>
          <div data-active={flags.includes('!')} data-flag="!" onclick={actions.random.flags}>!@#...</div>
          <div data-active={flags.includes('O')} data-flag="O" onclick={actions.random.flags}>No 0oO</div>
        </Radio>

        <button onclick={actions.app.refresh}>Refresh</button>
      </Card>

      <Card title="Result">
        <span>Password</span><CopyToClipboard from="password" />
        <TextArea id="password" readonly value={result} />
      </Card>
  </div>
  );
}