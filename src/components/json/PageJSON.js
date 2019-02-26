import { h } from 'hyperapp';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import './actions';
import { queryObject } from "./json";
import CopyToClipboard from "../CopyToClipboard";
import Checkbox from "../Checkbox";

let objSource, obj;

export default () => (state, actions) => {

  const {
    parse,
    path,
    input
  } = state.json;

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
      <TextArea autofocus
                onChange={actions.json.set} value={input}/>

      <Checkbox label={<span><code>JSON.parse</code> first</span>} checked={parse} onchange={actions.json.parse} />

      <label>Path expression:</label>
      <TextBox startAddon="JSON" placeholder=".x" value={path} onChange={actions.json.path}/>

      <h1>Result (Prettified)</h1>
      {!error && <CopyToClipboard from="pretty-json" />}
      {error
        ? <p style={{color:'red'}}>{error}</p>
        : <TextArea readonly value={result} id="pretty-json" />}
    </div>
  );
}