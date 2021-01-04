import React from "react";
import { TextArea, TextBox, CopyToClipboard } from "../_lib";
import { actions } from "./PageCrypto.store";
import loadFileAsync from "helpers/loadFileAsync";
import styled from "styled-components";

const onDragOver = e => {
  e.dataTransfer.dropEffect = "link";
  e.stopPropagation();
  e.preventDefault();
};

const onFileRead = fileContents => {
  document.getElementById("crypto_cert_pem").innerText = fileContents;
  actions.loaded(fileContents);
};

const onDrop = e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  loadFileAsync(file, onFileRead);
  actions.onDragLeave(e);
};
const onFileChange = e => {
  const file = e.target.files && e.target.files[0];
  loadFileAsync(file, onFileRead);
};

const onPEMChange = e => {
  const pem = e.target.innerText;
  actions.loaded(pem);
};

const UploadLabel = styled.label`
  display: inline-block !important;
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
`;

const DraggingTextArea = styled(TextArea)`
  ${({ theme, dragging }) => (dragging ? `border-color: ${theme.secondaryColor};` : "")};
`;

const CryptoHash = ({
  pem,
  output,
  fingerprints,
  dragging
}: {
  pem: string,
  output: string,
  fingerprints: Object,
  dragging: boolean
}) => (
  <div
    onDragEnter={actions.onDragEnter}
    onDragOver={onDragOver}
    onDragLeave={actions.onDragLeave}
    onDrop={onDrop}
  >
    <div>
      PEM Certificate (Paste, Drop or{" "}
      <UploadLabel>
        Browse...
        <input type="file" style={{ display: "none" }} onChange={onFileChange} />
      </UploadLabel>
      )
    </div>
    <DraggingTextArea dragging={dragging} id="crypto_cert_pem" value={pem} onChange={onPEMChange} />

    <label>Certificate fields</label>
    <TextArea readOnly value={output} />

    <h3>Fingerprints</h3>
    <span>SHA-256:</span>
    <CopyToClipboard from="cert_sha256_print" />
    <TextBox id="cert_sha256_print" readOnly value={fingerprints?.sha256 ?? ""} />
    <span>SHA-1:</span>
    <CopyToClipboard from="cert_sha1_print" />
    <TextBox id="cert_sha1_print" readOnly value={fingerprints?.sha1 ?? ""} />
    <span>MD5:</span>
    <CopyToClipboard from="cert_md5_print" />
    <TextBox id="cert_md5_print" readOnly value={fingerprints?.md5 ?? ""} />
  </div>
);

export default CryptoHash;
