import { h } from 'hyperapp';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import { getInput, getPath } from './actions';
import { queryObject } from "./json";
import CopyToClipboard from "../CopyToClipboard";

let objSource, obj;

export default () => (state, actions) => {

  const input = getInput(state),
    path = getPath(state);

  let result, error = null;
  if (!input) {
    objSource = input;
    obj = null;
  }
  if (input && input !== objSource) {
    objSource = input;
    try {
      obj = JSON.parse(input);
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