import { h } from 'hyperapp';
import cc from 'classcat';
import {Link, Redirect} from '@hyperapp/router';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import Tabs from '../Tabs';
import './actions';
import styles from './PageJWT.less';
import CopyToClipboard from "../CopyToClipboard";

export default () => (state, actions) => {
  const encodeMode = state.jwt.encode;
  let resultHTML;

  resultHTML =
    `<div class="${styles.header}">${state.jwt.header || ''}</div>` +
    `<div class="${styles.payload}">${state.jwt.payload || ''}</div>` +
    `<div class="${styles.sig}">${state.jwt.sig || ''}</div>`;

  const secretTextbox = <TextBox value={state.jwt.secret}
                                 placeholder="Base64Url encoded secret"
                                 onChange={actions.jwt.secret} />;
  return (
    <div>
      <Tabs>
        <span data-active={!encodeMode} onclick={actions.jwt.toggle}>Decoder</span>
        <span data-active={encodeMode} onclick={actions.jwt.toggle}>Encoder</span>
      </Tabs>

      {encodeMode && (<div>
        <label>Algorithm</label>
        <TextBox value="HS256" readonly/>

        <TextArea className={styles.header} value={state.jwt.header} readonly />
        <TextArea className={styles.payload} value={state.jwt.in_payload} onChange={actions.jwt.in_payload} autofocus />
        <TextArea className={styles.sig} value={state.jwt.sig} readonly />

        <label>Secret key</label>
        {secretTextbox}
      </div>)}

      <span>Token</span><CopyToClipboard from="jwt" />
      <TextBox id="jwt" style={{maxWidth: "100%"}} autofocus={!encodeMode}
               value={encodeMode ? state.jwt.out_token : state.jwt.in_token}
               selectOnFocus
               onChange={actions.jwt.in_token}
               readonly={encodeMode} />

      {!encodeMode && (<div>
        { state.jwt.alg && (
          <label className={styles.emoji}>Verify <b>{state.jwt.alg}</b> Signature {state.jwt.valid ? "- ✔ Verified" : "- ❌ Not verified"}</label>)}
        {state.jwt.alg && secretTextbox}

        <label>Contents:</label>
        <TextArea readonly={!encodeMode} html className={styles.jwt}
                  value={resultHTML} />
      </div>)}
    </div>
  );
}