import React from 'react';
import {Radio, Tabs, TextArea, TextBox} from '../_lib';
import { Redirect, NavLink } from 'react-router-dom';

import { useStore, actions } from './PageChecksum.store';
import crcDatabase from "./crcDatabase";

import styles from './PageChecksum.less';

const PageChecksum = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');

  const type = pathSegments[1];
  if (!type) {
    return <Redirect to={`/${pathSegments[0]}/crc`}/>;
  }

  const state = useStore();

  const tabs = (
    <Tabs>
      <NavLink to={"/" + pathSegments[0] + "/crc"}>CRC</NavLink>
      <NavLink to={"/" + pathSegments[0] + "/luhn"}>Luhn</NavLink>
    </Tabs>
  );

  if (type === 'luhn') {
    const { input, valid, error } = state.luhn;

    return (
      <div>
        {tabs}

        <span>Input: (Digits)</span>
        <TextBox invalid={error} autoFocus onChange={actions.luhnInput} value={input} />


        <div className="emoji">
          {valid ? "✔ Valid" : "❌ Invalid"}
        </div>
      </div>
    );
  }
  else if (type === 'crc') {
    const { input, width, format, result } = state.crc;
    const name = state.crc["name" + width];
    const model = crcDatabase[width][name];
    const output = `polynomial = ${model[0].toString(16)}\ninit       = ${model[1].toString(16)}\nxorOut     = ${model[2].toString(16)}\ninputReflected  = ${model[3].toString(16)}\noutputReflected = ${model[4].toString(16)}`;

    return (
      <div>
        {tabs}

        <span>Input:</span>
        <TextArea autoFocus onChange={actions.crcInput} value={input} />

        <label>Input format:</label>
        <Radio className={styles.options} options={["Hex", "UTF-8"]} value={format} onClick={actions.crcFormat} />

        <label>Width:</label>
        <Radio className={styles.options} options={[8, 16, 32, 64]} value={width} onClick={actions.crcWidth} />

        <label>Name: (First is default)</label>
        <Radio className={styles.options} options={Object.keys(crcDatabase[width])} showEmptyWith={crcDatabase[width][''][5]} value={name} onClick={actions.crcName} />

        <label>Parameters:</label>
        <TextArea readOnly value={output} />

        <span>Output:</span>
        <TextBox readOnly value={"0x" + result.toString(16)} />
      </div>
    );
  }
};

export default PageChecksum;