import { h } from 'hyperapp';
import cc from 'classcat';
import {getToken, getHeader, getPayload, getSig, getEncode} from '../../actions/jwt';
import { decode, encode } from './jwt';
import styles from './PageJWT.less'

export default () => (state, actions) => {
  const handleTokenChange = e => actions.jwt.token(e.target.textContent),
    handleHeaderChange = e => actions.jwt.header(e.target.textContent),
    handlePayloadChange = e => actions.jwt.payload(e.target.textContent),
    handleSigChange = e => actions.jwt.sig(e.target.textContent),
    handleToggleMode = e => actions.jwt.toggle();
  const token = getToken(state),
    header = getHeader(state),
    payload = getPayload(state),
    sig = getSig(state),
    encodeMode = getEncode(state);

  let result;
  if (encodeMode) {
    result = encode(header, payload, sig);
  }
  else {
    result = decode(token);
  }

  return (
    <div className={styles.page}>
      <div className={styles.mode}>
        <span className={cc([styles.badge,{[styles.active]: !encodeMode }])} onclick={handleToggleMode}>Decoder</span>
        <span className={cc([styles.badge,{[styles.active]: encodeMode }])} onclick={handleToggleMode}>Encoder</span>
      </div>

      <h1>JWT</h1>

      <sub>JWT Token:</sub>
      <section className={cc([styles.textarea, { [styles.readonly]: encodeMode}])}>
          <pre contentEditable={!encodeMode}
               oninput={handleTokenChange}
               innerHTML={encodeMode ? result : undefined}
          />
      </section>

      <sub>JWT contents:</sub>
      <section className={cc([styles.textarea, styles.header, { [styles.readonly]: !encodeMode}])}>
          <pre contentEditable={encodeMode}
               oninput={handleHeaderChange}
               innerHTML={encodeMode ? undefined : result[0]}
          />
      </section>
      <section className={cc([styles.textarea, styles.payload, { [styles.readonly]: !encodeMode}])}>
          <pre contentEditable={encodeMode}
               oninput={handlePayloadChange}
               innerHTML={encodeMode ? undefined : result[1]}
          />
      </section>
      <section className={cc([styles.textarea, styles.sig, { [styles.readonly]: !encodeMode}])}>
          <pre contentEditable={encodeMode}
               oninput={handleSigChange}
               innerHTML={encodeMode ? undefined : result[2]}
          />
      </section>


    </div>
  );
}