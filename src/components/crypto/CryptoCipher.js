import React from "react";
import {Checkbox, Radio, TextArea, TextBox} from "../_lib";
import { Link } from 'react-router-dom';
import styles from "./PageCrypto.less";
import {actions} from "./PageCrypto.store";

const CryptoCipher = ({ tabs, alg, kdf, input, passphrase, useSalt, salt, cipherKey, iv, aesCounter, jwk, output } :
                        { tabs: any, alg: string, kdf: string, input: string, passphrase: string, useSalt: boolean, salt: string, cipherKey: string, iv: string, aesCounter: string, jwk: string, output: string }) => (
  <div>
    {tabs}

    <label>Algorithm:</label>
    <Radio className={styles.options2} options={["AES-CBC","AES-CTR","AES-GCM","RSA-OAEP"]} value={alg} onClick={actions.cipherAlg} />

    <label>Input:</label>
    <TextArea autoFocus onChange={actions.cipherInput} value={input}/>

    {alg === 'RSA-OAEP' ? (
      <>
        <label>JWK:</label>
        <TextArea autoComplete="off" onChange={actions.cipherJWK} value={jwk}/>

        <div className={styles.note}>* You can use the <Link to="/crypto/generate">generate</Link> page to generate a suitable key</div>
      </>
    ) : (
      <>
        <label>Standard KDF:</label>
        <Radio className={styles.options2} options={["None", "OpenSSL"]} value={kdf} onClick={actions.cipherKDF} />

        { kdf === 'None' && (
          <>
            <div className={styles.note}>* You can use the <Link to="/crypto/generate">generate</Link> page to generate a suitable key</div>

            <label>Key: (Hex)</label>
            <TextBox autoComplete="off" onChange={actions.cipherKey} value={cipherKey}/>
            {(alg === 'AES-CTR') && (
              <>
                <label>Counter: (Hex, 16 bytes, 64 bits x 2)</label>
                <TextBox autoComplete="off" onChange={actions.cipherAESCounter} value={aesCounter} placeholder="Leave blank to generate" />
              </>
            )}
            {(alg === 'AES-CBC' || alg === 'AES-GCM') && (
              <>
                <label>IV: (Hex, 16 bytes)</label>
                <TextBox autoComplete="off" onChange={actions.cipherIV} value={iv} placeholder="Leave blank to generate" />
              </>
            )}
          </>
        )}
        { kdf === 'OpenSSL' && (
          <>
            <div className={styles.note}>* Uses MD5 with one iteration</div>

            <label>Passphrase:</label>
            <TextBox autoComplete="off" onChange={actions.passphrase} value={passphrase}/>

            <Checkbox label="Salt: (Hex)" checked={useSalt} onChange={actions.useSalt}/>
            <TextBox autoComplete="off" disabled={!useSalt} onChange={actions.salt} value={salt} placeholder="Leave blank to generate"/>
          </>
        )}
      </>
    )}



    <div className={styles.actions}>
      <button onClick={actions.encrypt}>Encrypt</button>
      <button onClick={actions.decrypt}>Decrypt</button>
    </div>

    {output && (
      <>
        {output.kdf && <label>KDF output:</label>}
        {output.kdf && <TextArea readOnly value={output.kdf} />}

        <label>Output:</label>
        <TextArea readOnly value={output.output} />
      </>
    )}

  </div>
);

export default CryptoCipher;