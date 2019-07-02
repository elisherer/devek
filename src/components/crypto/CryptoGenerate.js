import React from "react";
import {CopyToClipboard, Radio, TextArea} from "../_lib";
import styles from "./PageCrypto.less";
import {actions} from "./PageCrypto.store";
import cx from "classnames";

const CryptoGenerate = ({ tabs, algType, symmAlg, asymAlg, hashAlg, rsaModulusLength, ecNamedCurve, aesKeyLength, publicKey, privateKey, format, symmKey, error } :
                        { tabs: any, algType: string, symmAlg: string, asymAlg: string, hashAlg: string, rsaModulusLength: number, ecNamedCurve: string, aesKeyLength: number, publicKey: string, privateKey: string, format: string, symmKey: string, error: string }) => (
  <div>
    {tabs}

    <label>Type:</label>
    <Radio className={styles.options2} options={["Symmetric", "Asymmetric"]} value={algType} onClick={actions.genAlgType} />

    { algType === 'Symmetric' ? (
      <>
        <label>Algorithm:</label>
        <Radio className={styles.options2} options={["HMAC", "AES-CTR", "AES-CBC", "AES-GCM", "AES-KW"]} value={symmAlg} onClick={actions.genSymmAlg} />

        <div>
          {symmAlg[0] === 'H' ? (
            <>
              <label>Hash function:</label>
              <Radio className={styles.options} options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"]} value={hashAlg} onClick={actions.genHashAlg} />
            </>
          ) : (
            <>
              <label>Length (Bits):</label>
              <Radio className={styles.options} options={[128,192,256]} value={aesKeyLength} onClick={actions.aesKeyLength} />
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={actions.genKey}>Generate</button>
        </div>

        <hr />

        <span>Key:</span><CopyToClipboard from="crypto_key"/>
        <TextArea id="crypto_key" readOnly className={cx({[styles.error]: error})} value={error || symmKey} />
        <div className={styles.input_info}>
          <sup>&nbsp;{!error ? (symmKey.length > 0 ? 'Length: ' + symmKey.length : '') : ''}</sup>
        </div>
      </>
    ) : (
      <>
        <label>Algorithm:</label>
        <Radio className={styles.options2} options={["RSA-OAEP","RSA-PSS","RSASSA-PKCS1-v1_5", "ECDSA","ECDH"]} value={asymAlg} onClick={actions.genAsymAlg} />

        <div>
          {asymAlg[0] === 'R' ? (
            <>
              <label>Hash function:</label>
              <Radio className={styles.options} options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"]} value={hashAlg} onClick={actions.genHashAlg} />
              <label>Modulus Length:</label>
              <Radio className={styles.options} options={[2048, 4096]} value={rsaModulusLength} onClick={actions.rsaModulusLength} />
            </>
          ) : (
            <>
              <label>Named Curve:</label>
              <Radio className={styles.options} options={["P-256","P-384","P-521"]} value={ecNamedCurve} onClick={actions.ecNamedCurve} />
            </>
          )}
        </div>

        <label>Format:</label>
        <Radio className={styles.options2} options={["JWK","X.509 (PKCS8+SPKI)",asymAlg === "RSASSA-PKCS1-v1_5"? "SSH (PKCS1)" : null]} value={format} onClick={actions.genFormat} />

        <div className={styles.actions}>
          <button onClick={actions.genKey}>Generate</button>
        </div>

        <hr />

        <span>Public Key:</span><CopyToClipboard from="crypto_public"/>
        <TextArea id="crypto_public" readOnly className={cx({[styles.error]: error})} value={error || publicKey} />
        <span>Private Key:</span><CopyToClipboard from="crypto_private"/>
        <TextArea id="crypto_private" readOnly value={error ? '' : privateKey} />

      </>
    )}

  </div>
);

export default CryptoGenerate;