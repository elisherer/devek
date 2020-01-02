import React from 'react';
import { CopyToClipboard, TextBox } from '../_lib';
import { Redirect } from 'react-router-dom';

import { useStore, actions } from './PageBase.store';

import styles from './PageBase.less';

const pageRoutes = ['numbers', 'text'];

const PageBase = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || '')) {
    return <Redirect to={'/' + pathSegments[0] + '/' + pageRoutes[0]} />;
  }

  const state = useStore();

  const { errors } = state;

  if (type === 'text') {
    const { utf8, hex, binary, base64, base64Url } = state;

    return (
      <div>
        <span>UTF8:</span><CopyToClipboard from="base_text_utf8"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.utf8} id="base_text_utf8" autoFocus onChange={actions.utf8} value={utf8} />
        </div>

        <span>Hex:</span><CopyToClipboard from="base_text_hex"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.hex} id="base_text_hex" onChange={actions.hex} value={hex}/>
        </div>

        <span>Binary:</span><CopyToClipboard from="base_text_binary"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.binary} id="base_text_binary" onChange={actions.binary} value={binary}/>
        </div>

        <span>Base64:</span><CopyToClipboard from="base_text_base64"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.base64} id="base_text_base64" value={base64} onChange={actions.base64} />
        </div>

        <span>Base64Url:</span><CopyToClipboard from="base_text_base64url"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.base64Url} id="base_text_base64url" value={base64Url} onChange={actions.base64Url} />
        </div>
      </div>
    );
  }

  const {
    fromBase,
    from,
    toBase,
    to
  } = state;

  return (
    <div>
      <span>From:</span><CopyToClipboard from="base_number_to"/><span className={styles.base_label}>Base:</span>
      <div className={styles.wrap}>
        <TextBox className={styles.number} invalid={errors.from} id="base_number_from" autoFocus onChange={actions.from} value={from} />
        <TextBox className={styles.base} onChange={actions.fromBase} type="number" value={fromBase} min={2} max={36}/>
      </div>

      <span>To:</span><CopyToClipboard from="base_number_to"/><span className={styles.base_label}>Base:</span>
      <div className={styles.wrap}>
        <TextBox className={styles.number} invalid={errors.to} id="base_number_to" onChange={actions.to} value={to}/>
        <TextBox className={styles.base} onChange={actions.toBase} type="number" value={toBase} min={2} max={36}/>
      </div>
    </div>
  );
};

export default PageBase;