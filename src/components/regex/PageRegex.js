import React from 'react';
import { Checkbox, Radio, TextArea, TextBox } from '../_lib';
import { useStore, actions } from './PageRegex.store';
import support from 'helpers/support';
import styled from 'styled-components';

let compiledRegex = null;

const Radio30Percent = styled(Radio)`
  div {
    flex-basis: 30%;
  }
`;

const PageRegex = () => {
  const state = useStore();

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
      matchesResults.push(<div key={c}>{msg}</div>);
      lastFind = m[0];
      lastIndex = m.index;
    }
  }

  return (
    <div>

      <label>Regular expression</label>
      <TextBox startAddon="/" placeholder=".*" endAddon={"/" + flags}
               value={regexSource} onChange={actions.regex} autoFocus />

      <label>Flags</label>
      <Radio30Percent>
        <div data-active={flags.includes('g') || null} data-flag="g" onClick={actions.flags}>Global</div>
        <div data-active={flags.includes('m') || null} data-flag="m" onClick={actions.flags}>Multi&#8209;line</div>
        <div data-active={flags.includes('i') || null} data-flag="i" onClick={actions.flags}>Insensitive</div>
        {support.RegExpFlags.includes('s') && <div data-active={flags.includes('s') || null} data-flag="s" onClick={actions.flags}>DotAll</div>}
        {support.RegExpFlags.includes('u') && <div data-active={flags.includes('u') || null} data-flag="u" onClick={actions.flags}>Unicode</div>}
        {support.RegExpFlags.includes('y') && <div data-active={flags.includes('y') || null} data-flag="y" onClick={actions.flags}>Sticky</div>}
      </Radio30Percent>

      <label>Test string</label>
      <TextArea onChange={actions.testString} value={testString} />

      <Checkbox label="Substitution" checked={withReplace} onChange={actions.withReplace} />

      {withReplace && <TextBox value={replace} onChange={actions.replace} />}

      <h1>Matches</h1>
      {!matchesResults || matchesResults.length === 0 ? <div>No matches</div> : (
        matchesResults
      )}

      {withReplace && <>
        <h1>Result</h1>
        <TextArea readOnly value={testString.replace(compiledRegex, replace)}/>
      </>}
    </div>
  );
};

export default PageRegex;