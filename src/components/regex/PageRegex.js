import React, {useReducer} from 'react';
import TextBox from '../../lib/TextBox';
import TextArea from '../../lib/TextArea';
import Radio from '../../lib/Radio';
import Checkbox from '../../lib/Checkbox';
import { initialState, reducer } from './actions';
import styles from './PageRegex.less'

let compiledRegex = null;

const PageRegex = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    regex: regexSource,
    flags,
    test: testString,
    withReplace,
    replace,
  } = state;

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

  const onFlagClick = e => dispatch({ type: 'flags', payload: e.target.dataset.flag });

  return (
    <div>

      <label>Regular expression</label>
      <TextBox startAddon="/" placeholder=".*" endAddon={"/" + flags}
               value={regexSource} onChange={e => dispatch({ type: 'regex', payload: e.target.value })} autofocus />

      <label>Flags</label>
      <Radio className={styles.flags}>
        <div data-active={flags.includes('g') || null} data-flag="g" onClick={onFlagClick}>Global</div>
        <div data-active={flags.includes('m') || null} data-flag="m" onClick={onFlagClick}>Multi&#8209;line</div>
        <div data-active={flags.includes('i') || null} data-flag="i" onClick={onFlagClick}>Insensitive</div>
      </Radio>

      <label>Test string</label>
      <TextArea onChange={e => dispatch({ type: 'testString', payload: e.target.textContent })} value={testString} />

      <Checkbox label="Substitution" checked={withReplace} onChange={e => dispatch({ type: 'withReplace', payload: e.target.checked })} />

      {withReplace && <TextBox value={replace} onChange={e => dispatch({ type: 'replace', payload: e.target.value })} />}

      <h1>Matches</h1>
      {!matchesResults || matchesResults.length === 0 ? <div>No matches</div> : (
        matchesResults
      )}

      {withReplace && <>
        <h1>Result</h1>
        <TextArea readonly value={testString.replace(compiledRegex, replace)}/>
      </>}
    </div>
  );
};

export default PageRegex;