import { h } from 'hyperapp';
import cc from 'classcat';
import TextBox from '../TextBox';
import Tabs from '../Tabs';
import Radio from '../Radio';
import CopyToClipboard from '../CopyToClipboard';
import { getFrom, getTo, getFromNumber, getToNumber, getFromError, getToError } from './actions';
import { Redirect, Link } from '@hyperapp/router';
import styles from './PageBase.less';
//import { textCategories, textFunctions } from "./text";

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

  if (type === 'text') {
    return (
      <div>
        {tabs}

        Under construction...
      </div>
    );
  }

  const from = getFrom(state),
    fromNumber = getFromNumber(state),
    fromError = getFromError(state),
    to = getTo(state),
    toNumber = getToNumber(state),
    toError = getToError(state);

  return (
    <div>
      {tabs}

      <span>From:</span><CopyToClipboard from="base_number_to"/>
      <div className={styles.wrap}>
        <TextBox className={cc([styles.number, { [styles.error]: fromError }])} id="base_number_from" autofocus onChange={actions.base.fromNumber} value={fromNumber} />
        <TextBox className={styles.base} onChange={actions.base.from} type="number" value={from} min={2} max={36}/>
      </div>

      <span>To:</span><CopyToClipboard from="base_number_to"/>
      <div className={styles.wrap}>
        <TextBox className={cc([styles.number, { [styles.error]: toError }])} id="base_number_to" onChange={actions.base.toNumber} value={toNumber}/>
        <TextBox className={styles.base} onChange={actions.base.to} type="number" value={to} min={2} max={36}/>
      </div>
    </div>
  );
}