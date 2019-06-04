import React from 'react';
import { CopyToClipboard, TextBox } from '../_lib';
import { useStore, actions } from './PageURL.store';

import styles from './PageURL.less';

const PageURL = () => {

  const { input } = useStore();
  let parsed, error = null;

  try {
    parsed = new URL(input);
  }
  catch (e) {
    parsed = null;
    error = e;
  }

  return (
    <div>
      <span>URL:</span>
      <TextBox autoFocus selectOnFocus invalid={error}
               value={input} onChange={actions.input} />
      <br />

      <table className={styles.table}>
        <colgroup>
          <col /><col /><col />
        </colgroup>
        <thead>
        <tr><th>Name</th><th>&nbsp;</th><th>Value</th></tr>
        </thead>
        <tbody>
        {["host","hostname","origin","protocol","username","password","port","pathname","search","hash"]
          .map(name =>
            <tr key={name}>
              <td><b>{name}</b></td>
              <td><CopyToClipboard from={`url_${name}`}/></td>
              <td id={`url_${name}`}>{parsed ? parsed[name] : ''}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PageURL;