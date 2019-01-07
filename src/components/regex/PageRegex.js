import { h } from 'hyperapp';
import { getInput, getTestString } from '../../actions/regex';
import styles from './PageRegex.less'

let compiledRegex = null;

export default () => (state, actions) => {
  const handleChange = e => actions.regex.set(e.target.value);
  const handleTestChange = e => actions.regex.setTest(e.target.textContent);
  const input = getInput(state);
  const testString = getTestString(state);

  if (input &&
    (!compiledRegex || compiledRegex.source !== input)) {
    try {
      compiledRegex = new RegExp(input, "gm");
    }
    catch (e) {
      compiledRegex = null;
    }
  }

  let matchesResults = [];
  if (input && compiledRegex) {
    let m, lastFind = null, lastIndex = null, c = 1;
    while ((m = compiledRegex.exec(testString)) !== null) {
      if (m[0] === lastFind && m.index === lastIndex) {
        //matchesResults.push(<p>Caught in an infinite loop</p>);
        break;
      }

      let msg = (c++) + '. Found ' + m[0] + ' at ' + m.index;
      matchesResults.push(<div>{msg}</div>);
      lastFind = m[0];
      lastIndex = m.index;
    }
  }

  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <h1>RegEx Tester</h1>
        <div>
          <sub>Regular expression</sub>
          <section className={styles.input_wrap }>
            / <input placeholder=".*" value={input}
                     oninput={handleChange}/> /gm
          </section>

          <sub>Test string</sub>
          <section className={styles.textarea}>
              <pre contentEditable
                   oninput={handleTestChange}
              />
          </section>
        </div>
      </div>

      <div className={styles.card}>

        <h1>Matches</h1>
        <div>
        {!matchesResults || matchesResults.length === 0 ? <div>No matches</div> : (
          matchesResults
        )}
        </div>
      </div>
    </div>
  );
}