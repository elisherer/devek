import React from 'react';
import {CopyToClipboard, Radio, TextArea} from "../_lib";
import {actions} from "./PageCrypto.store";
import devek from 'devek';

import styles from "./PageCrypto.less";

const CryptoHash = ({ tabs, input, alg, hash, format } : { tabs: any, input: string, alg: string, hash: Object, format: string }) => (
  <div>
    {tabs}

    <label>Input:</label>
    <TextArea autoFocus onChange={actions.hashInput} value={input}/>
    <div className={styles.input_info}>
      <sup>Length: {input.length}</sup>
    </div>

    <label>Algorithm:</label>
    <Radio className={styles.options} options={["SHA-1", "SHA-256", "SHA-384", "SHA-512", "MD5"]} value={alg} onClick={actions.hashAlg} />

    <label>Output format:</label>
    {alg !== 'MD5' ? (
      <Radio className={styles.options} options={["Hex", "Base64"]} value={format} onClick={actions.hashFormat} />
    ) : (
      <Radio className={styles.options} options={["Hex"]} value="Hex" />
    )}

    <span>Hash:</span><CopyToClipboard from="crypto_hash"/>
    <TextArea id="crypto_hash" readOnly
              className={styles.long_output}
              value={typeof hash === 'string' ? hash : (format === 'Base64' ? devek.arrayToBase64(hash) : devek.arrayToHexString(hash))}
    />
    <div className={styles.input_info}>
      <sup>&nbsp;{(alg === 'MD5' ? hash.length / 2 : hash.byteLength) + " Bytes"}</sup>
    </div>
  </div>
);

export default CryptoHash;