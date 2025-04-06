import { CopyToClipboard, Radio, TextArea } from "../_lib";
import { actions } from "./PageCrypto.store";
import devek from "@/devek";

import styled from "styled-components";

const SmallInfo = styled.div`
  text-align: right;
  vertical-align: super;
  font-size: smaller;
`;

const LongTextArea = styled(TextArea)`
  max-width: 728px;
`;

const CryptoHash = ({
  input,
  alg,
  hash,
  format
}: {
  input: string,
  alg: string,
  hash: Object,
  format: string
}) => (
  <div>
    <label>Input:</label>
    <TextArea autoFocus onChange={actions.hashInput} value={input} />
    <SmallInfo>Length: {input.length}</SmallInfo>
    <label>Algorithm:</label>
    <Radio
      flexBasis={20}
      options={["SHA-1", "SHA-256", "SHA-384", "SHA-512", "MD5"]}
      value={alg}
      onClick={actions.hashAlg}
    />
    <label>Output format:</label>
    {alg !== "MD5" ? (
      <Radio
        flexBasis={20}
        options={["Hex", "Base64"]}
        value={format}
        onClick={actions.hashFormat}
      />
    ) : (
      <Radio flexBasis={20} options={["Hex"]} value="Hex" />
    )}
    <span>Hash:</span>
    <CopyToClipboard from="crypto_hash" />
    <LongTextArea
      id="crypto_hash"
      readOnly
      value={
        typeof hash === "string"
          ? hash
          : format === "Base64"
          ? devek.arrayToBase64(hash)
          : devek.arrayToHexString(hash)
      }
    />
    <SmallInfo>&nbsp;{(alg === "MD5" ? hash.length / 2 : hash.byteLength) + " Bytes"}</SmallInfo>
  </div>
);

export default CryptoHash;
