import React from 'react';
import {TextArea} from "../_lib";
import {actions} from "./PageCrypto.store";
import styles from "./PageCrypto.less";
import cx from "classnames";
import {loadFileAsync} from "./cert";

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

const onDrop = e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  loadFileAsync(file, actions.loaded);
  actions.onDragLeave(e);
};
const onFileChange = e => {
  const file = e.target.files && e.target.files[0];
  loadFileAsync(file, actions.loaded);
};

const CryptoHash = ({ tabs, pem, output, dragging } : { tabs: any, pem: string, output: string, dragging: boolean }) => (
  <div onDragEnter={actions.onDragEnter} onDragOver={onDragOver}
       onDragLeave={actions.onDragLeave} onDrop={onDrop}>
    {tabs}

    <label className={cx(styles.dropbox, { [styles.dragging]: dragging })}>
      Click and browse for a certificate or Drag & Drop it here
      <input type="file" style={{display: 'none'}} onChange={onFileChange} />
    </label>

    <label>PEM Certificate</label>
    <TextArea readOnly value={pem} />

    <label>Certificate fields</label>
    <TextArea readOnly value={output} />
  </div>
);

export default CryptoHash;