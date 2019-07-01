import React from "react";
import {Checkbox, Radio, TextArea, TextBox} from "../_lib";
import styles from "./PageCrypto.less";
import {actions} from "./PageCrypto.store";

const CryptoCipher = ({ tabs, alg, kdf, input, passphrase, useSalt, salt, output } :
                        { tabs: any, alg: string, kdf: string, input: string, passphrase: string, useSalt: boolean, salt: string, output: string }) => (
  <div>
    {tabs}

    <label>Algorithm:</label>
    <Radio className={styles.options2} options={["AES-CBC","AES-CTR","AES-GCM","RSA-OAEP"]} value={alg} onClick={actions.cipherAlg} />

    <label>Input:</label>
    <TextArea autoFocus onChange={actions.cipherInput} value={input}/>

    <label>KDF:</label>
    <Radio className={styles.options2} options={["None", "OpenSSL", "PBKDF2"]} value={kdf} onClick={actions.cipherKDF} />

    {kdf === "OpenSSL" && <div className={styles.note}>* Uses MD5 with one iteration</div>}

    <label>Passphrase:</label>
    <TextBox type="password" autoComplete="off" onChange={actions.passphrase} value={passphrase}/>

    <Checkbox label="Salt: (Hex)" checked={useSalt} onChange={actions.useSalt}/>
    <TextBox disabled={!useSalt} onChange={actions.salt} value={salt} placeholder="Leave empty to generate salt"/>

    <div className={styles.actions}>
      <button onClick={actions.encrypt}>Encrypt</button>
      <button onClick={actions.decrypt}>Decrypt</button>
    </div>

    {output && (
      <>
        <label>Encryption data:</label>
        <TextArea readOnly value={output.meta} />

        <label>Output:</label>
        <TextArea readOnly value={output.output} />
      </>
    )}

  </div>
);

export default CryptoCipher;