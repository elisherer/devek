import React from 'react';
import {TextArea} from "../_lib";
import {actions} from "./PageCrypto.store";
import loadFileAsync from "helpers/loadFileAsync";
import styled from 'styled-components';

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

const onFileRead = fileContents => {
  document.getElementById('crypto_cert_pem').innerText = fileContents;
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
  pre {
    border-color: ${({ theme, dragging }) => dragging ? theme.secondaryColor : 'inherit'};
  }
`;

const CryptoHash = ({ pem, output, dragging } : { pem: string, output: string, dragging: boolean }) => (
  <div onDragEnter={actions.onDragEnter} onDragOver={onDragOver}
       onDragLeave={actions.onDragLeave} onDrop={onDrop}>
    <div>
      PEM Certificate (Paste, Drop or <UploadLabel>Browse...<input type="file" style={{display: 'none'}} onChange={onFileChange} /></UploadLabel>)
    </div>
    <DraggingTextArea dragging={dragging} id="crypto_cert_pem" value={pem} onChange={onPEMChange}/>

    <label>Certificate fields</label>
    <TextArea readOnly value={output} />
  </div>
);

export default CryptoHash;