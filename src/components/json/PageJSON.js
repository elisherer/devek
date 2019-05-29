import React from 'react';
import TextBox from '../../lib/TextBox';
import TextArea from '../../lib/TextArea';
import Checkbox from "../../lib/Checkbox";
import CopyToClipboard from "../../lib/CopyToClipboard";
import { useStore, actions } from './actions';
import { queryObject } from "./json";

let objSource, obj;

const PageJSON = () => {
  const state = useStore();

  const {
    parse,
    path,
    input
  } = state;

  let source = input;
  let result, error = null;
  if (!source) {
    objSource = source;
    obj = null;
  }
  else if (parse) {
    try {
      source = JSON.parse(source);
      if (typeof source !== 'string') throw new Error("Must be parsed into a string");
    }
    catch (e) {
      error = 'JSON.parse error: ' + e.message;
    }
  }
  if (source && source !== objSource && !error) {
    objSource = source;
    try {
      obj = JSON.parse(objSource);
    }
    catch (e) {
      error = e.message;
    }
  }
  if (obj && !error) {
    try {
      result = queryObject(obj, path);
    }
    catch (e) {
      error = e.message;
    }
  }

  return (
    <div>
      <label>JSON:</label>
      <TextArea autoFocus onChange={actions.set} value={input}/>

      <Checkbox label={<span><code>JSON.parse</code> first</span>} checked={parse} onChange={actions.parse} />

      <label>Path expression:</label>
      <TextBox startAddon="JSON" placeholder=".x" value={path} onChange={actions.path}/>

      <h1>Result (Prettified)</h1>
      {!error && <CopyToClipboard from="pretty-json" />}
      {error
        ? <p style={{color:'red'}}>{error}</p>
        : <TextArea readOnly value={result} id="pretty-json" />}
    </div>
  );
};

export default PageJSON;