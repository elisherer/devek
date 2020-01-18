import React from "react";
import {Checkbox, CopyToClipboard, Radio, TextArea, TextBox} from "../_lib";
import { Link } from 'react-router-dom';
import {actions} from "./PageCrypto.store";

import styled from "styled-components";

const ActionsWrapper = styled.div`
  padding-bottom: 10px;
  button {
    margin-right: 6px;
    margin-bottom: 4px;
  }
`;

const ErrorText = styled.span`
  color: red;
`;

const NoteText = styled.div`
  padding: 6px;
  border: 1px solid #dddddd;
  background-color: #eeeeee;
  margin-bottom: 20px;
`;

const CryptoCipher = ({ alg, kdf, position, input, passphrase, useSalt, salt, cipherKey, iv, aesCounter, jwk, output } :
                        { alg: string, kdf: string, position: string, input: string, passphrase: string, useSalt: boolean, salt: string, cipherKey: string, iv: string, aesCounter: string, jwk: string, output: string }) => (
  <div>
    <label>Algorithm:</label>
    <Radio flexBasis={30} options={["AES-CBC","AES-CTR","AES-GCM","RSA-OAEP"]} value={alg} onClick={actions.cipherAlg} />

    <label>Input: (UTF-8 for encrypt, Base64 for decrypt)</label>
    <TextArea autoFocus onChange={actions.cipherInput} value={input}/>

    {alg === 'RSA-OAEP' ? (
      <>
        <label>JWK:</label>
        <TextArea autoComplete="off" onChange={actions.cipherJWK} value={jwk}/>

        <NoteText>* You can use the <Link to="/crypto/generate">generate</Link> page to generate a suitable key</NoteText>
      </>
    ) : (
      <>
        <label>Standard KDF:</label>
        <Radio flexBasis={30} options={["None", "OpenSSL"]} value={kdf} onClick={actions.cipherKDF} />

        { kdf === 'None' && (
          <>
            <label>Position of {alg === 'AES-CTR' ? "CTR" : "IV"} in cipher:</label>
            <Radio flexBasis={30} options={["Start", "End", "None"]} value={position} onClick={actions.cipherPosition} />


            <NoteText>* You can use the <Link to="/crypto/generate">generate</Link> page to generate a suitable key</NoteText>

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
            <NoteText>* Uses MD5 with one iteration</NoteText>

            <label>Passphrase:</label>
            <TextBox autoComplete="off" onChange={actions.passphrase} value={passphrase}/>

            <Checkbox label="Salt: (Hex)" checked={useSalt} onChange={actions.useSalt}/>
            <TextBox autoComplete="off" disabled={!useSalt} onChange={actions.salt} value={salt} placeholder="Leave blank to generate/extract"/>
          </>
        )}
      </>
    )}

    <ActionsWrapper>
      <button onClick={actions.encrypt}>Encrypt</button>
      <button onClick={actions.decrypt}>Decrypt</button>
    </ActionsWrapper>

    <hr />

    {output && (output.error ? <ErrorText>{output.error}</ErrorText> : (
      <>
        {output.properties && <label>Cipher properties:</label>}
        {output.properties && <TextArea readOnly value={output.properties} />}

        <label>Format:</label>
        <Radio flexBasis={30} options={["Base64", "Hex", "UTF-8"]} value={output.format} onClick={actions.cipherFormat} />

        <span>Output:</span><CopyToClipboard from="crypto_cipher_out"/>
        <TextArea id="crypto_cipher_out" readOnly value={output.formatted} />
      </>
    ))}

  </div>
);

export default CryptoCipher;