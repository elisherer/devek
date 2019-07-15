import React from 'react';
import { CopyToClipboard, TextArea } from '../_lib';
import { useStore, actions } from './PageList.store';

import styles from './PageList.less';

const PageList = () => {
  const { input, output } = useStore();

  return (
    <div>
      <p>Enter your list (item per line)</p>
      <span>Source:</span>
      <TextArea autoFocus id="list_input" value={input} onChange={actions.input} />

      <div className={styles.actions}>
        <button onClick={actions.transform} data-transform="addComma">Add commas</button>
        <button onClick={actions.transform} data-transform="singleQuotes">Wrap with single quotes</button>
        <button onClick={actions.transform} data-transform="doubleQuotes">Wrap with double quotes</button>
        <button onClick={actions.sort} data-sort="text" data-order="asc">Sort by A-Z</button>
        <button onClick={actions.sort} data-sort="number" data-order="asc">Sort By Number</button>
        <button onClick={actions.sort} data-sort="text" data-order="desc">Sort by A-Z (Desc)</button>
        <button onClick={actions.sort} data-sort="number" data-order="desc">Sort By Number (Desc)</button>
        <button onClick={actions.removeNewLines}>Remove New lines</button>
        <button onClick={actions.splitByComma}>Split by comma</button>
      </div>

      <span>Output:</span><CopyToClipboard from="list_output"/>
      <TextArea id="list_output" readOnly lineNumbers value={output} />
      <button onClick={actions.copy} data-copyto="list_input">Copy output to source</button>
    </div>
  );
};

export default PageList;