import { h } from 'hyperapp';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import Tabs from '../Tabs';
import './actions';
import styles from './PageJWT.less';
import CopyToClipboard from "../CopyToClipboard";

export default () => (state, actions) => {
  const encodeMode = state.jwt.encode;

  const tabs = (
    <Tabs>
      <span data-active={!encodeMode} onclick={actions.jwt.toggle}>Decoder</span>
      <span data-active={encodeMode} onclick={actions.jwt.toggle}>Encoder</span>
    </Tabs>
  );

  const secretTextbox = <TextBox value={state.jwt.secret}
                                 placeholder="Base64Url encoded secret"
                                 onChange={actions.jwt.secret} />;

  if (encodeMode) {
    return (
      <div>
        {tabs}

        <label>Algorithm</label>
        <TextBox value="HS256" readonly/>

        <TextArea className={styles.header} value={state.jwt.header} readonly />
        <TextArea className={styles.payload} value={state.jwt.in_payload} onChange={actions.jwt.in_payload} autofocus />
        <TextArea className={styles.sig} value={state.jwt.secret ? state.jwt.sig : ''} readonly />

        <label>Secret key</label>
        {secretTextbox}

        {state.jwt.error
          ? <p style={{color: 'red'}}>{state.jwt.error}</p> : (
            <div>
              <span>Token</span><CopyToClipboard from="jwt"/>
              <TextBox id="jwt"
                       className={styles.token}
                       invalid={state.jwt.error}
                       value={state.jwt.out_token}
                       selectOnFocus
                       readonly />
            </div>
          )
        }
      </div>
    );
  }

  const resultHTML =
    `<div class="${styles.header}">${state.jwt.header || ''}</div>` +
    `<div class="${styles.payload}">${state.jwt.payload || ''}</div>` +
    `<div class="${styles.sig}">${state.jwt.sig || ''}</div>`;

  return (
    <div>
      {tabs}

      <span>Token</span><CopyToClipboard from="jwt"/>
      <TextBox id="jwt" autofocus selectOnFocus
               className={styles.token}
               invalid={state.jwt.error}
               value={state.jwt.in_token}
               onChange={actions.jwt.in_token} />
      { state.jwt.error && (
        <p style={{color: 'red'}}>{state.jwt.error}</p>
      )}
      { state.jwt.alg && (
        <label className="emoji">Verify <b>{state.jwt.alg}</b> Signature {state.jwt.valid ? "- ✔ Verified" : "- ❌ Not verified"}</label>
      )}
      {state.jwt.alg && secretTextbox}

      <label>Contents:</label>
      <TextArea readonly={!encodeMode} html className={styles.jwt}
                value={resultHTML} />
    </div>
  );
}