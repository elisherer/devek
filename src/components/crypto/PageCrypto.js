import React from 'react';
import {Checkbox, CopyToClipboard, Radio, Tabs, TextArea, TextBox} from '../_lib';
import { Redirect, NavLink } from 'react-router-dom';
import { useStore, actions } from './PageCrypto.store';
import cx from "classnames";
import { loadFileAsync} from "./cert";

import styles from './PageCrypto.less';

const toBase64 = buf => window.btoa(String.fromCharCode(...new Uint8Array(buf)));
const toHex = buf => [...new Uint8Array(buf)].map(value => value.toString(16).padStart(2, '0')).join('');

const subPages = [
  {
    path: 'hash',
    title: 'Hash'
  },
  {
    path: 'cipher',
    title: 'Cipher'
  },
  {
    path: 'generate',
    title: 'Generate Keys'
  },
  {
    path: 'cert',
    title: 'Certificate parser'
  }
];

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

const onDrop = e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  loadFileAsync(file, actions.loaded);
  actions.onDragLeave(e);
};
const onFileChange = e => {
  const file = e.target.files && e.target.files[0];
  loadFileAsync(file, actions.loaded);
};


const PageCrypto = () => {
  const pathSegments = location.pathname.substr(1).split('/');

  const type = pathSegments[1];
  if (!type || !subPages.find(sp => sp.path === type)) {
    return <Redirect to={`/${pathSegments[0]}/${subPages[0].path}`} />;
  }

  const tabs = (
    <Tabs>
      {subPages.map(subPage => (
        <NavLink key={subPage.path} to={`/${pathSegments[0]}/${subPage.path}`}>{subPage.title}</NavLink>
      ))}
    </Tabs>
  );

  const state = useStore();

  if (type === 'hash') {

    const { input, hashAlg, error, hash, outputFormat } = state;

    return (
      <div>
        {tabs}

        <label>Input:</label>
        <TextArea autoFocus onChange={actions.input} value={input}/>
        <div className={styles.input_info}>
          <sup>Length: {input.length}</sup>
        </div>

        <label>Algorithm:</label>
        <Radio className={styles.options}>
          <div data-active={hashAlg === "SHA-1" || null} data-value="SHA-1" onClick={actions.hashAlg}>SHA-1</div>
          <div data-active={hashAlg === "SHA-256" || null} data-value="SHA-256" onClick={actions.hashAlg}>SHA-256</div>
          <div data-active={hashAlg === "SHA-384" || null} data-value="SHA-384" onClick={actions.hashAlg}>SHA-384</div>
          <div data-active={hashAlg === "SHA-512" || null} data-value="SHA-512" onClick={actions.hashAlg}>SHA-512</div>
          <div data-active={hashAlg === "MD5" || null} data-value="MD5" onClick={actions.hashAlg}>MD5</div>
        </Radio>

        <label>Output format:</label>
        {hashAlg !== 'MD5' ? (
          <Radio className={styles.options}>
            <div data-active={outputFormat === "hex" || null} data-value="hex" onClick={actions.format}>Hex</div>
            <div data-active={outputFormat === "base64" || null} data-value="base64" onClick={actions.format}>Base64</div>
          </Radio>
        ) : (
          <Radio className={styles.options}>
            <div data-active={true} data-format="hex">Hex</div>
          </Radio>
        )}

        <span>Hash:</span><CopyToClipboard from="crypto_hash"/>
        <TextArea id="crypto_hash" readOnly
                  className={cx(styles.long_output, {[styles.error]: error})}
                  value={error || typeof hash === 'string' ? hash : (outputFormat === 'base64' ? toBase64(hash) : toHex(hash))}
        />
        <div className={styles.input_info}>
          <sup>&nbsp;{!error && (hash.length > 0 ? 'Length: ' + hash.length : hash.byteLength > 0 ? hash.byteLength + " Bytes" : '')}</sup>
        </div>
      </div>
    );
  }
  else if (type === 'generate') {

    const { genType, genSymmAlg, genAsymAlg, genHashAlg, rsaModulusLength, ecNamedCurve, aesKeyLength, publicKey, privateKey, publicSSH, symmKey, genError } = state;

    return (
      <div>
        {tabs}

        <label>Type:</label>
        <Radio className={styles.options}>
          <div data-active={genType === 'symmetric' || null} data-value="symmetric" onClick={actions.genType}>Symmetric</div>
          <div data-active={genType === 'asymmetric' || null} data-value="asymmetric" onClick={actions.genType}>Asymmetric</div>
        </Radio>

        { genType === 'symmetric' ? (
          <>
            <label>Algorithm:</label>
            <Radio className={styles.options2}>
              <div data-active={genSymmAlg === "HMAC" || null} data-value="HMAC" onClick={actions.genSymmAlg}>HMAC</div>
              <div data-active={genSymmAlg === "AES-CTR" || null} data-value="AES-CTR" onClick={actions.genSymmAlg}>AES-CTR</div>
              <div data-active={genSymmAlg === "AES-CBC" || null} data-value="AES-CBC" onClick={actions.genSymmAlg}>AES-CBC</div>
              <div data-active={genSymmAlg === "AES-GCM" || null} data-value="AES-GCM" onClick={actions.genSymmAlg}>AES-GCM</div>
              <div data-active={genSymmAlg === "AES-KW" || null} data-value="AES-KW" onClick={actions.genSymmAlg}>AES-KW</div>
            </Radio>

            <div>
              {genSymmAlg[0] === 'H' ? (
                <>
                  <label>Hash function:</label>
                  <Radio className={styles.options}>
                    <div data-active={genHashAlg === 'SHA-1' || null} data-value="SHA-1" onClick={actions.genHashAlg}>SHA-1</div>
                    <div data-active={genHashAlg === 'SHA-256' || null} data-value="SHA-256" onClick={actions.genHashAlg}>SHA-256</div>
                    <div data-active={genHashAlg === 'SHA-384' || null} data-value="SHA-384" onClick={actions.genHashAlg}>SHA-384</div>
                    <div data-active={genHashAlg === 'SHA-512' || null} data-value="SHA-512" onClick={actions.genHashAlg}>SHA-512</div>
                  </Radio>
                </>
              ) : (
                <>
                  <label>Length (Bits):</label>
                  <Radio className={styles.options}>
                    <div data-active={aesKeyLength === 128 || null} data-value="128" onClick={actions.aesKeyLength}>128</div>
                    <div data-active={aesKeyLength === 192 || null} data-value="192" onClick={actions.aesKeyLength}>192</div>
                    <div data-active={aesKeyLength === 256 || null} data-value="256" onClick={actions.aesKeyLength}>256</div>
                  </Radio>
                </>
              )}
            </div>

            <div className={styles.actions}>
              <button onClick={actions.genKey}>Generate</button>
            </div>

            <hr />

            <span>Key:</span><CopyToClipboard from="crypto_key"/>
            <TextArea id="crypto_key" readOnly className={cx({[styles.error]: genError})} value={genError || symmKey} />
            <div className={styles.input_info}>
              <sup>&nbsp;{!genError ? (symmKey.length > 0 ? 'Length: ' + symmKey.length : '') : ''}</sup>
            </div>
          </>
        ) : (
          <>
            <label>Algorithm:</label>
            <Radio className={styles.options2}>
              <div data-active={genAsymAlg === "RSA-OAEP" || null} data-value="RSA-OAEP" onClick={actions.genAsymAlg}>RSA-OAEP</div>
              <div data-active={genAsymAlg === "RSA-PSS" || null} data-value="RSA-PSS" onClick={actions.genAsymAlg}>RSA-PSS</div>
              <div data-active={genAsymAlg === "RSASSA-PKCS1-v1_5" || null} data-value="RSASSA-PKCS1-v1_5" onClick={actions.genAsymAlg}>RSASSA PKCS1 v1.5</div>
              <div data-active={genAsymAlg === "ECDSA" || null} data-value="ECDSA" onClick={actions.genAsymAlg}>ECDSA</div>
              <div data-active={genAsymAlg === "ECDH" || null} data-value="ECDH" onClick={actions.genAsymAlg}>ECDH</div>
            </Radio>

            <div>
              {genAsymAlg[0] === 'R' ? (
                <>
                  <label>Hash function:</label>
                  <Radio className={styles.options}>
                    <div data-active={genHashAlg === 'SHA-1' || null} data-value="SHA-1" onClick={actions.genHashAlg}>SHA-1</div>
                    <div data-active={genHashAlg === 'SHA-256' || null} data-value="SHA-256" onClick={actions.genHashAlg}>SHA-256</div>
                    <div data-active={genHashAlg === 'SHA-384' || null} data-value="SHA-384" onClick={actions.genHashAlg}>SHA-384</div>
                    <div data-active={genHashAlg === 'SHA-512' || null} data-value="SHA-512" onClick={actions.genHashAlg}>SHA-512</div>
                  </Radio>

                  <label>Modulus Length:</label>
                  <Radio className={styles.options}>
                    <div data-active={rsaModulusLength === 2048 || null} data-value={2048} onClick={actions.rsaModulusLength}>2048</div>
                    <div data-active={rsaModulusLength === 4096 || null} data-value={4096} onClick={actions.rsaModulusLength}>4096</div>
                  </Radio>

                </>
              ) : (
                <>
                  <label>Named Curve:</label>
                  <Radio className={styles.options}>
                    <div data-active={ecNamedCurve === "P-256" || null} data-value="P-256" onClick={actions.ecNamedCurve}>P-256</div>
                    <div data-active={ecNamedCurve === "P-384" || null} data-value="P-384" onClick={actions.ecNamedCurve}>P-384</div>
                    <div data-active={ecNamedCurve === "P-521" || null} data-value="P-521" onClick={actions.ecNamedCurve}>P-521</div>
                  </Radio>
                </>
              )}
            </div>

            <div className={styles.actions}>
              <button onClick={actions.genKey}>Generate</button>
            </div>

            <hr />

            <span>Public Key:</span><CopyToClipboard from="crypto_public"/>
            <TextArea id="crypto_public" readOnly className={cx({[styles.error]: genError})} value={genError || publicKey} />
            <span>Private Key:</span><CopyToClipboard from="crypto_private"/>
            <TextArea id="crypto_private" readOnly value={genError ? '' : privateKey} />

            {publicSSH && <>
              <span>Public SSH:</span><CopyToClipboard from="crypto_ssh"/>
              <TextArea className={styles.long_output} id="crypto_ssh" readOnly value={genError ? '' : publicSSH} />
            </>}
          </>
        )}

      </div>
    );
  }
  else if (type === 'cert') {

    const { pem, certOutput, dragging } = state;

    return (
      <div onDragEnter={actions.onDragEnter} onDragOver={onDragOver}
           onDragLeave={actions.onDragLeave} onDrop={onDrop}>
        {tabs}

        <label className={cx(styles.dropbox, { [styles.dragging]: dragging })}>
          Click and browse for a certificate or Drag & Drop it here
          <input type="file" style={{display: 'none'}} onChange={onFileChange} />
        </label>

        <label>PEM Certificate</label>
        <TextArea readOnly value={pem} />

        <label>Certificate fields</label>
        <TextArea readOnly value={certOutput} />
      </div>
    )
  }
  else if (type === 'cipher') {
    const { cipherAlg, cipherType, cipherInput, passphrase, useSalt, salt, cipherOutput } = state;

    return (
      <div>
        {tabs}

        <label>Algorithm:</label>
        <Radio className={styles.options2}>
          <div data-active={cipherAlg === "AES-CBC" || null} data-value="AES-CBC" onClick={actions.cipherAlg}>AES-CBC</div>
          <div data-active={cipherAlg === "AES-CTR" || null} data-value="AES-CTR" onClick={actions.cipherAlg}>AES-CTR</div>
          <div data-active={cipherAlg === "AES-GCM" || null} data-value="AES-GCM" onClick={actions.cipherAlg}>AES-GCM</div>
          <div data-active={cipherAlg === "RSA-OAEP" || null} data-value="RSA-OAEP" onClick={actions.cipherAlg}>RSA-OAEP</div>
        </Radio>

        <label>Type: </label>
        <Radio className={styles.options2}>
          <div data-active={cipherType === "OpenSSL" || null} data-value="OpenSSL" onClick={actions.cipherType}>OpenSSL KDF</div>
          <div data-active={cipherType === "PBKDF2" || null} data-value="PBKDF2" onClick={actions.cipherType}>PBKDF2</div>
          <div data-active={cipherType === "Key Data" || null} data-value="Key Data" onClick={actions.cipherType}>Key Data</div>
        </Radio>


        <label>Input:</label>
        <TextArea autoFocus onChange={actions.cipherInput} value={cipherInput}/>

        <label>Passphrase:</label>
        <TextBox type="password" autoComplete="off" onChange={actions.passphrase} value={passphrase}/>

        <Checkbox label="Salt: (Hex)" checked={useSalt} onChange={actions.useSalt}/>
        <TextBox disabled={!useSalt} onChange={actions.salt} value={salt} placeholder="Leave empty to generate salt"/>

        <div className={styles.actions}>
          <button onClick={actions.encrypt}>Encrypt</button>
          <button onClick={actions.decrypt}>Decrypt</button>
        </div>

        {cipherOutput && (
          <>
            <label>Encryption data:</label>
            <TextArea readOnly value={cipherOutput.meta} />

            <label>Output:</label>
            <TextArea readOnly value={cipherOutput.output} />
          </>
        )}

        </div>
    )
  }
};

export default PageCrypto;