import { h } from 'hyperapp';
//import { getInput } from '../actions/text';
import styles from './PageRegex.less'

export default ({ location, match }) => (state, actions) => {
  //const handleChange = e => actions.text.set(e.target.innerText);
  //const input = getInput(state);


  return (
    <div>
      <h1>RegEx</h1>
      <section className={styles.input_wrap }>
        /<input placeholder="insert regex"/>/gm
      </section>
    </div>
  );
}