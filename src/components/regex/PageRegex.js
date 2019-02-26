import { h } from 'hyperapp';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import Radio from '../Radio';
import Checkbox from '../Checkbox';
import { getRegex, getFlags, getTestString, getWithReplace, getReplace } from './actions';
import styles from './PageRegex.less'

let compiledRegex = null;

export default () => (state, actions) => {
  const regexSource = getRegex(state),
    flags = getFlags(state),
    testString = getTestString(state),
    withRepalce = getWithReplace(state),
    replace = getReplace(state);

  if (regexSource &&
    (!compiledRegex || compiledRegex.source !== regexSource || compiledRegex.flags !== flags)) {
    try {
      compiledRegex = new RegExp(regexSource, flags);
    }
    catch (e) {
      compiledRegex = null;
    }
  }

  let matchesResults = [];
  if (regexSource && compiledRegex) {
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
    <div>

      <label>Regular expression</label>
      <TextBox startAddon="/" placeholder=".*" endAddon={"/" + flags}
               value={regexSource} onChange={actions.regex.regex} autofocus />

      <label>Flags</label>
      <Radio className={styles.flags}>
        <div data-active={flags.includes('g')} data-flag="g" onclick={actions.regex.flags}>Global</div>
        <div data-active={flags.includes('m')} data-flag="m" onclick={actions.regex.flags}>Multi&#8209;line</div>
        <div data-active={flags.includes('i')} data-flag="i" onclick={actions.regex.flags}>Insensitive</div>
      </Radio>

      <label>Test string</label>
      <TextArea onChange={actions.regex.testString} value={testString} />

      <Checkbox label="Substitution" checked={withRepalce} onchange={actions.regex.withReplace} />

      {withRepalce && <TextBox value={replace} onChange={actions.regex.replace} />}

      <h1>Matches</h1>
      {!matchesResults || matchesResults.length === 0 ? <div>No matches</div> : (
        matchesResults
      )}

      {withRepalce && [
        <h1>Result</h1>,
        <TextArea readonly value={testString.replace(compiledRegex, replace)}/>
      ]}
    </div>
  );
}