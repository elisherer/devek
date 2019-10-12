import React from 'react';
import { Redirect }  from 'react-router-dom';
import { CopyToClipboard, TextArea, TextBox } from '../_lib';
import styles from './PageJWT.less';

import { useStore, actions } from './PageJWT.store';

const pageRoutes = ['decode', 'encode', ];

const PageJWT = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');
  const type = pathSegments[1];
  if (!pageRoutes.includes(type)) {
    return <Redirect to={'/' + pathSegments[0] + '/' + pageRoutes[0]}/>;
  }

  const state = useStore();

  const secretTextbox = <TextBox value={state.secret}
                                 placeholder="Base64Url encoded secret"
                                 onChange={actions.secret} />;

  if (type === 'encode') {
    return (
      <div>
        <label>Algorithm</label>
        <TextBox value="HS256" readOnly />

        <TextArea wrapperClassName={styles.area} className={styles.header} value={state.header} readOnly />
        <TextArea wrapperClassName={styles.area} className={styles.payload} value={state.in_payload} onChange={actions.in_payload} autoFocus />
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
      <TextArea readOnly={type === 'decode'} html className={styles.jwt}
                value={resultHTML} />
    </div>
  );
};

export default PageJWT;