import { h } from 'hyperapp';

import { getInput } from '../actions/text';

import styles from './PageText.less'

export default () => (state, actions) => {
  const handleChange = e => actions.text.set(e.target.value);
  return (
    <div>
      <h1>Text</h1>
      <section>
        <input className={styles.input}
               onchange={handleChange}
               onkeyup={handleChange}
        />
      </section>
      <section className={styles.output}>
        <div>Length: {getInput(state).length}</div>
        <div>Lowercase: {getInput(state).toLowerCase()}</div>
        <div>Uppercase: {getInput(state).toUpperCase()}</div>
      </section>
    </div>
  );
}