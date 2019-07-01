import React from 'react';
import {CopyToClipboard, Radio, TextArea} from "../_lib";
import {actions} from "./PageCrypto.store";
import styles from "./PageCrypto.less";

const toBase64 = buf => window.btoa(String.fromCharCode(...new Uint8Array(buf)));
const toHex = buf => [...new Uint8Array(buf)].map(value => value.toString(16).padStart(2, '0')).join('');

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
              value={typeof hash === 'string' ? hash : (format === 'Base64' ? toBase64(hash) : toHex(hash))}
    />
    <div className={styles.input_info}>
      <sup>&nbsp;{hash.length > 0 ? 'Length: ' + hash.length : hash.byteLength > 0 ? hash.byteLength + " Bytes" : ''}</sup>
    </div>
  </div>
);

export default CryptoHash;