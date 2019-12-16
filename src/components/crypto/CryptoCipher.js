import React from "react";
import {Checkbox, CopyToClipboard, Radio, TextArea, TextBox} from "../_lib";
import { Link } from 'react-router-dom';
import {actions} from "./PageCrypto.store";

import styles from "./PageCrypto.less";

const CryptoCipher = ({ alg, kdf, position, input, passphrase, useSalt, salt, cipherKey, iv, aesCounter, jwk, output } :
                        { alg: string, kdf: string, position: string, input: string, passphrase: string, useSalt: boolean, salt: string, cipherKey: string, iv: string, aesCounter: string, jwk: string, output: string }) => (
  <div>
    <label>Algorithm:</label>
    <Radio className={styles.options2} options={["AES-CBC","AES-CTR","AES-GCM","RSA-OAEP"]} value={alg} onClick={actions.cipherAlg} />

    <label>Input: (UTF-8 for encrypt, Base64 for decrypt)</label>
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
            <label>Position of {alg === 'AES-CTR' ? "CTR" : "IV"} in cipher:</label>
            <Radio className={styles.options2} options={["Start", "End", "None"]} value={position} onClick={actions.cipherPosition} />


            <div className={styles.note}>* You can use the <Link to="/crypto/generate">generate</Link> page to generate a suitable key</div>

            <label>Key: (Hex)</label>
            <TextBox autoComplete="off" onChange={actions.cipherKey} value={cipherKey}/>
            {(alg === 'AES-CTR') && (
              <>
                <label>Counter: (Hex, 16 bytes, 64 bits x 2)</label>
                <TextBox autoComplete="off" onChange={actions.cipherAESCounter} value={aesCounter} placeholder="Leave blank to generate/extract" />
              </>
            )}
            {(alg === 'AES-CBC' || alg === 'AES-GCM') && (
              <>
                <label>IV: (Hex, 16 bytes)</label>
                <TextBox autoComplete="off" onChange={actions.cipherIV} value={iv} placeholder="Leave blank to generate/extract" />
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
            <TextBox autoComplete="off" disabled={!useSalt} onChange={actions.salt} value={salt} placeholder="Leave blank to generate/extract"/>
          </>
        )}
      </>
    )}

    <div className={styles.actions}>
      <button onClick={actions.encrypt}>Encrypt</button>
      <button onClick={actions.decrypt}>Decrypt</button>
    </div>

    <hr />

    {output && (output.error ? <span className={styles.error}>{output.error}</span> : (
      <>
        {output.properties && <label>Cipher properties:</label>}
        {output.properties && <TextArea readOnly value={output.properties} />}

        <label>Format:</label>
        <Radio className={styles.options2} options={["Base64", "Hex", "UTF-8"]} value={output.format} onClick={actions.cipherFormat} />

        <span>Output:</span><CopyToClipboard from="crypto_cipher_out"/>
        <TextArea id="crypto_cipher_out" readOnly value={output.formatted} />
      </>
    ))}

  </div>
);

export default CryptoCipher;