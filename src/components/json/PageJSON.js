import { h } from 'hyperapp';
import Card from '../Card';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import { getInput, getPath } from 'actions/json';
import { queryObject } from "./json";
import styles from './PageJSON.less';

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
    <div className={styles.page}>
      <Card>

        <label>JSON:</label>
        <TextArea autofocus
                  onChange={actions.json.set} value={input}/>

        <label>Path expression:</label>
        <TextBox startAddon="JSON" placeholder=".x" value={path} onChange={actions.json.path}/>
      </Card>

      <Card title="Result (Prettified)">
        {error
          ? <p className={styles.error}>{error}</p>
          : <TextArea readonly value={result} />}
      </Card>
  </div>
  );
}