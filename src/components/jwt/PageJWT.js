import { h } from 'hyperapp';
import {Link, Redirect} from '@hyperapp/router';
import Card from '../Card';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import Tabs from '../Tabs';
import {getToken } from 'actions/jwt';
import { decode, encode } from './jwt';
import styles from './PageJWT.less';

export default () => (state, actions) => {
  const pathSegments = location.pathname.substr(1).split('/');

  if (pathSegments.length < 2) {
    return <Redirect to={`/${pathSegments[0]}/decode`}/>;
  }

  const token = getToken(state);
  let result, resultHTML;
  if (pathSegments[1] === 'encode') {
    result = encode({});
  }
  else {
    result = decode(token);

    resultHTML =
      `<div class="${styles.header}">${result[0] || ''}</div>` +
      `<div class="${styles.payload}">${result[1] || ''}</div>` +
      `<div class="${styles.sig}">${result[2] || ''}</div>`;
  }

  const cardHeader = (
    <Tabs>
      <Link data-active={pathSegments[1] === 'decode'} to="/jwt/decode">Decoder</Link>
      <Link data-active={pathSegments[1] === 'encode'} to="/jwt/encode">Encoder</Link>
    </Tabs>
  );

  if (pathSegments[1] === 'encode') {
    return (
      <div className={styles.page}>
        <Card header={cardHeader}>
        Under construction...
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Card header={cardHeader}>

        <label>Token</label>
        <TextBox value={token} autofocus selectOnFocus
                 onChange={actions.jwt.token} />

        <label>Contents:</label>
        <TextArea readonly html
                  value={resultHTML} />
      </Card>
    </div>
  );
}