import React from 'react';
import TextArea from '../../lib/TextArea';
import CopyToClipboard from '../../lib/CopyToClipboard';
import Radio from "../../lib/Radio";
import { useStore, actions } from './PageHash.store';
import cx from "classnames";

import styles from './PageHash.less';

const toBase64 = buf => window.btoa(String.fromCharCode(...new Uint8Array(buf)));
const toHex = buf => [...new Uint8Array(buf)].map(value => value.toString(16).padStart(2, '0')).join('');

const PageHash = () => {

  const { input, alg, error, hash, outputFormat } = useStore();

  return (
    <div>

      <label>Input:</label>
      <TextArea autoFocus onChange={actions.input} value={input}/>
      <div className={styles.input_info}>
        <sup>Length: {input.length}</sup>
      </div>

      <label>Algorithm:</label>
      <Radio className={styles.options}>
        <div data-active={alg === "SHA-1"||null} data-alg="SHA-1" onClick={actions.alg}>SHA-1</div>
        <div data-active={alg === "SHA-256"||null} data-alg="SHA-256" onClick={actions.alg}>SHA-256</div>
        <div data-active={alg === "SHA-384"||null} data-alg="SHA-384" onClick={actions.alg}>SHA-384</div>
        <div data-active={alg === "SHA-512"||null} data-alg="SHA-512" onClick={actions.alg}>SHA-512</div>
      </Radio>

      <label>Output format:</label>
      <Radio className={styles.options}>
        <div data-active={outputFormat === "hex"||null} data-format="hex" onClick={actions.format}>Hex</div>
        <div data-active={outputFormat === "base64"||null} data-format="base64" onClick={actions.format}>Base64</div>
      </Radio>

      <span>Hash:</span><CopyToClipboard from="hash_output"/>
      <TextArea id="text_output" readOnly
                className={cx({[styles.error]: error})}
                value={error || (outputFormat === 'base64' ? toBase64(hash) : toHex(hash))}
      />
      <div className={styles.input_info}>
        <sup>&nbsp;{!error && hash.byteLength > 0 ? hash.byteLength + " Bytes": ''}</sup>
      </div>


    </div>
  );
};

export default PageHash;