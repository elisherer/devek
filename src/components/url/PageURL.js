import React, { Fragment } from 'react';
import TextBox from '../../lib/TextBox';
import CopyToClipboard from "../../lib/CopyToClipboard";
import { useStore, actions } from './PageURL.store';

const PageURL = () => {

  const { input } = useStore();
  let parsed, error = null;

  try {
    parsed = new URL(input);
  }
  catch (e) {
    parsed = null;
    error = e;
  }

  return (
    <div>
      <span>URL:</span><CopyToClipboard from="url_input"/>
      <TextBox id="url_input" autoFocus selectOnFocus
               invalid={error}
               value={input}
               onChange={actions.input} />
      <br />
      <hr />
      {["host","hostname","origin","protocol","username","password","port","pathname","search","hash"]
        .map(name =>
        <Fragment key={name}>
          <span>{name}</span>
          <CopyToClipboard from={`url_${name}`}/>
          <TextBox id={`url_${name}`} readOnly value={parsed ? parsed[name] : ''} />
        </Fragment>
      )}
    </div>
  );
};

export default PageURL;