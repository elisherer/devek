import { CopyToClipboard, Radio, TextArea } from "../_lib";
import { Link } from "react-router-dom";
import { actions } from "./PageCrypto.store";

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
  background: ${({ theme }) => theme.greyBorder};
  margin-bottom: 20px;
`;

const aliases = {
  "RSASSA-PKCS1-v1_5": "RS",
  "RSA-PSS": "PS",
  ECDSA: "ES",
  HMAC: "HS"
};

const CryptoSign = ({
  alg,
  hashAlg,
  publicKey,
  privateKey,
  secretKey,
  secretFormat,
  signature,
  input,
  output
}: {
  alg: string,
  hashAlg: string,
  publicKey: string,
  privateKey: string,
  secretKey: string,
  secretFormat: string,
  signature: string,
  input: string,
  output: string
}) => (
  <div>
    <label>Algorithm:</label>
    <Radio
      flexBasis={30}
      options={["RSASSA-PKCS1-v1_5", "RSA-PSS", "ECDSA", "HMAC"]}
      value={alg}
      onClick={actions.signAlg}
    />
    <label>Hash function:</label>
    <Radio
      flexBasis={20}
      options={["SHA-256", "SHA-384", "SHA-512"]}
      value={hashAlg}
      onClick={actions.signHashAlg}
    />

    <label>
      Chosen algorithm:{" "}
      <strong>
        {aliases[alg]}
        {hashAlg.substr(4)}
      </strong>
    </label>

    <label>Input: (UTF-8)</label>
    <TextArea autoFocus onChange={actions.signInput} value={input} />

    {alg !== "HMAC" ? (
      <>
        <label>Public Key (Verification): (JWK / PEM (PKCS#1/X.509))</label>
        <TextArea autoComplete="off" onChange={actions.signPublicKey} value={publicKey} />

        <label>Private Key (Signing): (JWK / PEM (PKCS#1/PKCS#8))</label>
        <TextArea autoComplete="off" onChange={actions.signPrivateKey} value={privateKey} />

        <NoteText>
          * You can use the <Link to="/crypto/generate">generate</Link> page to generate a suitable
          key
        </NoteText>
      </>
    ) : (
      <>
        <label>Secret Format:</label>
        <Radio
          flexBasis={30}
          options={["Base64", "Hex", "UTF-8"]}
          value={secretFormat}
          onClick={actions.signSecretFormat}
        />
        <label>Secret Key: ({secretFormat})</label>
        <TextArea autoComplete="off" onChange={actions.signSecretKey} value={secretKey} />
      </>
    )}

    <label>Signature: (Base64; For verification)</label>
    <TextArea onChange={actions.signSignature} value={signature} />

    <ActionsWrapper>
      <button onClick={actions.verify}>Verify</button>
      <button onClick={actions.sign}>Sign</button>
    </ActionsWrapper>

    <hr />

    {output &&
      (output.error ? (
        <ErrorText>{output.error}</ErrorText>
      ) : (
        <>
          <label>Format:</label>
          <Radio
            flexBasis={30}
            options={["Base64", "Hex", "UTF-8"]}
            value={output.format}
            onClick={actions.signFormat}
          />

          <span>Output:</span>
          <CopyToClipboard from="crypto_sign_out" />
          <TextArea id="crypto_sign_out" readOnly value={output.formatted} />
        </>
      ))}
  </div>
);

export default CryptoSign;
