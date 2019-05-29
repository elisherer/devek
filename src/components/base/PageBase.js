import React, {useReducer} from 'react';
import TextBox from '../../lib/TextBox';
import Tabs from '../../lib/Tabs';
import CopyToClipboard from '../../lib/CopyToClipboard';
 import { Redirect, NavLink } from 'react-router-dom';

import styles from './PageBase.less';

const PageBase = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');

  const type = pathSegments[1];
  if (!type) {
    return <Redirect to={`/${pathSegments[0]}/numbers`}/>;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const tabs = (
    <Tabs>
      <NavLink to={"/" + pathSegments[0] + "/numbers"}>Numbers</NavLink>
      <NavLink to={"/" + pathSegments[0] + "/text"}>Text</NavLink>
    </Tabs>
  );

  const { errors } = state;

  if (type === 'text') {
    const { utf8, hex, binary, base64 } = state;

    return (
      <div>
        {tabs}

        <span>UTF8:</span><CopyToClipboard from="base_text_utf8"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.utf8} id="base_text_utf8" autofocus onChange={e => dispatch({ type: 'utf8', payload: e.target.value })} value={utf8} />
        </div>

        <span>Hex:</span><CopyToClipboard from="base_text_hex"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.hex} id="base_text_hex" onChange={e => dispatch({ type: 'hex', payload: e.target.value })} value={hex}/>
        </div>

        <span>Binary:</span><CopyToClipboard from="base_text_binary"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.binary} id="base_text_binary" onChange={e => dispatch({ type: 'binary', payload: e.target.value })} value={binary}/>
        </div>

        <span>Base64:</span><CopyToClipboard from="base_text_base64"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.base64} id="base_text_base64" value={base64} onChange={e => dispatch({ type: 'base64', payload: e.target.value })} />
        </div>
      </div>
    );
  }

  const {
    fromBase,
    from,
    toBase,
    to
  } = state;

  return (
    <div>
      {tabs}

      <span>From:</span><CopyToClipboard from="base_number_to"/><span className={styles.base_label}>Base:</span>
      <div className={styles.wrap}>
        <TextBox className={styles.number} invalid={errors.from} id="base_number_from" autofocus onChange={e => dispatch({ type: 'from', payload: e.target.value })} value={from} />
        <TextBox className={styles.base} onChange={e => dispatch({ type: 'fromBase', payload: e.target.value })} type="number" value={fromBase} min={2} max={36}/>
      </div>

      <span>To:</span><CopyToClipboard from="base_number_to"/><span className={styles.base_label}>Base:</span>
      <div className={styles.wrap}>
        <TextBox className={styles.number} invalid={errors.to} id="base_number_to" onChange={e => dispatch({ type: 'to', payload: e.target.value })} value={to}/>
        <TextBox className={styles.base} onChange={e => dispatch({ type: 'toBase', payload: e.target.value })} type="number" value={toBase} min={2} max={36}/>
      </div>
    </div>
  );
};

export default PageBase;