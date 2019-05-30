import React from 'react';
import TextBox from '../../lib/TextBox';
import TextArea from '../../lib/TextArea';
import Tabs from '../../lib/Tabs';
import styles from './PageJWT.less';
import CopyToClipboard from "../../lib/CopyToClipboard";

import { useStore, actions } from './actions';

const PageJWT = () => {
  const state = useStore('jwt');

  const encodeMode = state.encode;

  const tabs = (
    <Tabs>
      <span data-active={!encodeMode || null} onClick={actions.toggle}>Decoder</span>
      <span data-active={encodeMode || null} onClick={actions.toggle}>Encoder</span>
    </Tabs>
  );

  const secretTextbox = <TextBox value={state.secret}
                                 placeholder="Base64Url encoded secret"
                                 onChange={actions.secret} />;

  if (encodeMode) {
    return (
      <div>
        {tabs}

        <label>Algorithm</label>
        <TextBox value="HS256" readOnly />

        <TextArea className={styles.header} value={state.header} readOnly />
        <TextArea className={styles.payload} value={state.in_payload} onChange={actions.in_payload} autoFocus />
        <TextArea className={styles.sig} value={state.secret ? state.sig : ''} readOnly />

        <label>Secret key</label>
        {secretTextbox}

        {state.error
          ? <p style={{color: 'red'}}>{state.error}</p> : (
            <div>
              <span>Token</span><CopyToClipboard from="jwt"/>
              <TextBox id="jwt"
                       className={styles.token}
                       invalid={state.error}
                       value={state.out_token}
                       selectOnFocus
                       readOnly />
            </div>
          )
        }
      </div>
    );
  }

  const resultHTML =
    `<div class="${styles.header}">${state.header || ''}</div>` +
    `<div class="${styles.payload}">${state.payload || ''}</div>` +
    `<div class="${styles.sig}">${state.sig || ''}</div>`;

  return (
    <div>
      {tabs}

      <span>Token</span><CopyToClipboard from="jwt"/>
      <TextBox id="jwt" autoFocus selectOnFocus
               className={styles.token}
               invalid={state.error}
               value={state.in_token}
               onChange={actions.in_token} />
      { state.error && (
        <p style={{color: 'red'}}>{state.error}</p>
      )}
      { state.alg && (
        <label className="emoji">Verify <b>{state.alg}</b> Signature {state.valid ? "- ✔ Verified" : "- ❌ Not verified"}</label>
      )}
      {state.alg && secretTextbox}

      <label>Contents:</label>
      <TextArea readOnly={!encodeMode} html className={styles.jwt}
                value={resultHTML} />
    </div>
  );
};

export default PageJWT;