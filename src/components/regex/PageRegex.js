import { h } from 'hyperapp';
import Card from '../Card';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import { getInput, getTestString } from 'actions/regex';
import styles from './PageRegex.less'

let compiledRegex = null;

export default () => (state, actions) => {
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
      <Card title="RegEx Tester">

        <label>Regular expression</label>
        <TextBox startAddon="/" placeholder=".*" endAddon="/gm"
                 value={input} onChange={actions.regex.set} autofocus />

        <label>Test string</label>
        <TextArea onChange={actions.regex.setTest} value={testString} />
      </Card>

      <Card title="Matches">
        {!matchesResults || matchesResults.length === 0 ? <div>No matches</div> : (
          matchesResults
        )}
      </Card>
    </div>
  );
}