import React from 'react';
import { CopyToClipboard, TextBox } from '../_lib';
import { useStore, actions } from './PageURL.store';
import qs from './qs';
import styled from 'styled-components';

const Table = styled.table`
  th { 
    text-align: left; 
    height: 30px;
  }
  td, th {
    vertical-align: top;
  }
`;

const PageURL = () => {

  const { input } = useStore();
  let parsed, query = {}, error = null;

  try {
    parsed = new URL(input);
    query = qs(parsed.search);
  }
  catch (e) {
    parsed = null;
    error = e;
  }

  return (
    <div>
      <span>URL:</span>
      <TextBox autoFocus selectOnFocus invalid={error}
               value={input} onChange={actions.input} />
      <br />

      <Table>
        <colgroup>
          <col /><col /><col />
        </colgroup>
        <thead>
        <tr><th>Name</th><th>&nbsp;</th><th>Value</th></tr>
        </thead>
        <tbody>
        {["host","hostname","origin","protocol","username","password","port","pathname","hash","search"]
          .map(name =>
            <tr key={name}>
              <td><b>{name}</b></td>
              <td><CopyToClipboard from={`url_${name}`}/></td>
              <td id={`url_${name}`}>{parsed ? parsed[name] : ''}</td>
            </tr>
          )}
          <tr>
              <td><b>searchParams</b></td>
              <td><CopyToClipboard from="url_searchParams"/></td>
              <td id="url_searchParams"><pre>{JSON.stringify(query, null, 2)}</pre></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default PageURL;