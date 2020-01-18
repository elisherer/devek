import React from "react";
import {CopyToClipboard, Radio, TextArea, TextBox} from "../_lib";
import {actions} from "./PageCrypto.store";
import {SSH_SUPPORT} from "./generate";
import styled from "styled-components";

const SmallInfo = styled.div`
  text-align: right;
  vertical-align: super;
  font-size: smaller;
`;

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

const CryptoGenerate = ({ algType, symmAlg, asymAlg, hashAlg, rsaModulusLength, ecNamedCurve, aesKeyLength, publicKey, privateKey, privateSSH, format, source, kdf, symmKey, outputKey, error } :
                        { algType: string, symmAlg: string, asymAlg: string, hashAlg: string, rsaModulusLength: number, ecNamedCurve: string, aesKeyLength: number, publicKey: string, privateKey: string, privateSSH: string, format: string, source: string, kdf: Object, symmKey: string, outputKey: CryptoKey, error: string }) => (
  <div>
    <label>Type:</label>
    <Radio flexBasis={30} options={["Symmetric", "Asymmetric"]} value={algType} onClick={actions.genAlgType} />

    { algType === 'Symmetric' ? (
      <>
        <label>Algorithm:</label>
        <Radio flexBasis={30} options={["HMAC", "AES-CTR", "AES-CBC", "AES-GCM", "AES-KW"]} value={symmAlg} onClick={actions.genSymmAlg} />

        {symmAlg[0] === 'H' ? (
          <>
            <label>Hash function:</label>
            <Radio flexBasis={20} options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"]} value={hashAlg} onClick={actions.genHashAlg} />
          </>
        ) : (
          <>
            <label>Length (Bits):</label>
            <Radio flexBasis={20} options={[128,192,256]} value={aesKeyLength} onClick={actions.aesKeyLength} />
          </>
        )}
        <label>Source:</label>
        <Radio flexBasis={20} options={["Random", "PBKDF2"]} value={source} onClick={actions.genSource} />

        {
          source === 'PBKDF2' && (
            <>
              <label>Passphrase:</label>
              <TextBox autoComplete="off" onChange={actions.genKdfPassphrase} value={kdf.passphrase}/>

              <label>Salt: (Hex)</label>
              <TextBox autoComplete="off" onChange={actions.genKdfSalt} value={kdf.salt} placeholder="Leave blank to generate"/>

              <label>Hash algorithm</label>
              <Radio flexBasis={20} options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"]} value={kdf.hash} onClick={actions.genKdfHashAlg} />

              <label>Iterations</label>
              <TextBox type="number" onChange={actions.genKdfIterations} value={kdf.iterations} />
            </>
          )
        }
      </>
    ) : (
      <>
        <label>Algorithm:</label>
        <Radio flexBasis={30} options={["RSA-OAEP","RSA-PSS","RSASSA-PKCS1-v1_5", "ECDSA","ECDH"]} value={asymAlg} onClick={actions.genAsymAlg} />

        {asymAlg[0] === 'R' ? (
          <>
            <label>Hash function:</label>
            <Radio flexBasis={20} options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"]} value={hashAlg} onClick={actions.genHashAlg} />
            <label>Modulus Length:</label>
            <Radio flexBasis={20} options={[2048, 4096]} value={rsaModulusLength} onClick={actions.rsaModulusLength} />
          </>
        ) : (
          <>
            <label>Named Curve:</label>
            <Radio flexBasis={20} options={["P-256","P-384","P-521"]} value={ecNamedCurve} onClick={actions.ecNamedCurve} />
          </>
        )}
      </>
    )}

    <ActionsWrapper>
      <button onClick={actions.genKey}>Generate</button>
    </ActionsWrapper>

    <hr />

    {error
      ? <ErrorText>{error}</ErrorText>
      : !outputKey ? null :
      outputKey.extractable ? (
        <>
          <span>Key:</span><CopyToClipboard from="crypto_key"/>
          <TextArea id="crypto_key" readOnly value={symmKey} />
          <SmallInfo>&nbsp;{!error ? (symmKey.length > 0 ? 'Length: ' + symmKey.length : '') : ''}</SmallInfo>
          {kdf.output && (
            <>
              <span>KDF Output:</span><CopyToClipboard from="crypto_key_kdf"/>
              <TextArea id="crypto_key_kdf" value={kdf.output} readOnly />
            </>
          )}
        </>
      ) : (
        <>
          <label>Format:</label>
          <Radio flexBasis={30} options={["JWK","X.509 (PKCS8+SPKI)", SSH_SUPPORT[outputKey.privateKey.algorithm.name] ? "SSH" : null]} value={format} onClick={actions.genFormat} />

          <span>Public Key:</span><CopyToClipboard from="crypto_public"/>
          <TextArea id="crypto_public" readOnly  value={publicKey} />
          <span>Private Key:</span><CopyToClipboard from="crypto_private"/>
          <TextArea id="crypto_private" readOnly value={privateKey} />
          {privateSSH && (
            <>
              <span>Private Key (OpenSSH):</span><CopyToClipboard from="crypto_private_ssh"/>
              <TextArea id="crypto_private_ssh" readOnly value={privateSSH} />
            </>
          )}
        </>
      )
    }

  </div>
);

export default CryptoGenerate;