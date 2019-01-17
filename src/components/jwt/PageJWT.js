import { h } from 'hyperapp';
import cc from 'classcat';
import {Link, Redirect} from '@hyperapp/router';
import Card from '../Card';
import TextBox from '../TextBox';
import {getToken } from 'actions/jwt';
import { decode, encode } from './jwt';
import styles from './PageJWT.less';

export default () => (state, actions) => {
  const pathSegments = location.pathname.substr(1).split('/');

  if (pathSegments.length < 2) {
    return <Redirect to={`/${pathSegments[0]}/decode`}/>;
  }

  const token = getToken(state);
  let result;
  if (pathSegments[1] === 'encode') {
    result = encode({});
  }
  else {
    result = decode(token);
  }

  const cardHeader = (
    <div className={styles.tabs}>
      <Link className={cc({[styles.active]: pathSegments[1] === 'decode'})} to="/jwt/decode">Decoder</Link>
      <Link className={cc({[styles.active]: pathSegments[1] === 'encode'})} to="/jwt/encode">Encoder</Link>
    </div>
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
        <section className={styles.textarea}>
            <pre className={styles.header} innerText={result[0]} />
            <pre className={styles.payload} innerText={result[1]} />
            <pre className={styles.sig} innerText={result[2]} />
        </section>
      </Card>
    </div>
  );
}