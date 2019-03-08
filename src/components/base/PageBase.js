import { h } from 'hyperapp';
import TextBox from '../TextBox';
import Tabs from '../Tabs';
import CopyToClipboard from '../CopyToClipboard';
import './actions';
import { Redirect, Link } from '@hyperapp/router';
import styles from './PageBase.less';

export default ({ location, match }) => (state, actions) => {
  const pathSegments = location.pathname.substr(1).split('/');

  const type = pathSegments[1];
  if (!type) {
    return <Redirect to={`/${pathSegments[0]}/numbers`}/>;
  }

  const tabs = (
    <Tabs>
      <Link data-active={type === "numbers"} to={"/" + pathSegments[0] + "/numbers"}>Numbers</Link>
      <Link data-active={type === "text"} to={"/" + pathSegments[0] + "/text"}>Text</Link>
    </Tabs>
  );

  const
    errors = state.base.errors;

  if (type === 'text') {
    const { utf8, hex, binary } = state.base;

    return (
      <div>
        {tabs}


        <span>UTF8:</span><CopyToClipboard from="base_text_utf8"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.utf8} id="base_text_utf8" autofocus onChange={actions.base.utf8} value={utf8} />
        </div>

        <span>Hex:</span><CopyToClipboard from="base_text_hex"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.hex} id="base_text_hex" onChange={actions.base.hex} value={hex}/>
        </div>

        <span>Binary:</span><CopyToClipboard from="base_text_binary"/>
        <div className={styles.wrap}>
          <TextBox className={styles.number} invalid={errors.binary} id="base_text_binary" onChange={actions.base.binary} value={binary}/>
        </div>
      </div>
    );
  }

  const {
    fromBase,
    from,
    toBase,
    to
  } = state.base;

  return (
    <div>
      {tabs}

      <span>From:</span><CopyToClipboard from="base_number_to"/><span className={styles.base_label}>Base:</span>
      <div className={styles.wrap}>
        <TextBox className={styles.number} invalid={errors.from} id="base_number_from" autofocus onChange={actions.base.from} value={from} />
        <TextBox className={styles.base} onChange={actions.base.fromBase} type="number" value={fromBase} min={2} max={36}/>
      </div>

      <span>To:</span><CopyToClipboard from="base_number_to"/><span className={styles.base_label}>Base:</span>
      <div className={styles.wrap}>
        <TextBox className={styles.number} invalid={errors.to} id="base_number_to" onChange={actions.base.to} value={to}/>
        <TextBox className={styles.base} onChange={actions.base.toBase} type="number" value={toBase} min={2} max={36}/>
      </div>
    </div>
  );
}