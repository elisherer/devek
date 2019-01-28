import { h } from 'hyperapp';
import cc from 'classcat';
import {Link, Redirect} from '@hyperapp/router';
import Card from '../Card';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import Tabs from '../Tabs';
import {getSecret, getToken} from 'actions/jwt';
import { decode, encode } from './jwt';
import styles from './PageJWT.less';
import CopyToClipboard from "../CopyToClipboard";

export default () => (state, actions) => {
  const pathSegments = location.pathname.substr(1).split('/');

  if (pathSegments.length < 2) {
    return <Redirect to={`/${pathSegments[0]}/decode`}/>;
  }

  const token = getToken(state),
    secret = getSecret(state),
    encodeMode = pathSegments[1] === 'encode';
  let result, resultHTML;
  if (encodeMode) {
    result = encode({});
  }
  else {
    result = decode(token, secret);

    resultHTML =
      `<div class="${styles.header}">${result[0] || ''}</div>` +
      `<div class="${styles.payload}">${result[1] || ''}</div>` +
      `<div class="${styles.sig}">${result[2] || ''}</div>`;
  }

  const tabs = (
    <Tabs>
      <Link data-active={pathSegments[1] === 'decode'} to="/jwt/decode">Decoder</Link>
      <Link data-active={pathSegments[1] === 'encode'} to="/jwt/encode">Encoder</Link>
    </Tabs>
  );

  if (encodeMode) {
    return (
      <div className={styles.page}>
        <Card>
          {tabs}

        Under construction...
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Card>
        {tabs}



        <span>Token</span><CopyToClipboard from="jwt" />


        <TextBox id="jwt" value={token} autofocus selectOnFocus style={{maxWidth: "100%"}}
                 onChange={actions.jwt.token} />

        <label>Contents:</label>
        <TextArea readonly html className={styles.jwt}
                  value={resultHTML} />

        <label>Validate Signature</label>
        <TextBox value={secret} placeholder="Base64 encoded secret"
                 onChange={actions.jwt.secret} />
        <TextBox className={cc([result[3] === result[2] ? styles.valid : styles.error])}
                 inputClassName={cc([result[3] === result[2] ? styles.valid : styles.error])}
                 readonly value={result[3] || 'N/A'}/>
      </Card>
    </div>
  );
}