import { h } from 'hyperapp';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import {getInput, getParse, getPath} from './actions';
import { queryObject } from "./json";
import CopyToClipboard from "../CopyToClipboard";

let objSource, obj;

export default () => (state, actions) => {

  const parse = getParse(state),
    path = getPath(state);
  let input = getInput(state);

  let result, error = null;
  if (!input) {
    objSource = input;
    obj = null;
  }
  else if (parse) {
    try {
      input = JSON.parse(input);
      if (typeof input !== 'string') throw new Error("Must be parsed into a string");
    }
    catch (e) {
      error = 'JSON.parse error: ' + e.message;
    }
  }
  if (input && input !== objSource && !error) {
    objSource = input;
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

      <label><input type="checkbox" checked={parse} onchange={actions.json.parse}/> <code>JSON.parse</code> first</label>

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