import { h } from 'hyperapp';
import cc from 'classcat';
import TextBox from '../TextBox';
import Tabs from '../Tabs';
import CopyToClipboard from '../CopyToClipboard';
import { getErrors, getFromBase, getToBase, getFromNumber, getToNumber } from './actions';
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

  const errors = getErrors(state),
    fromBase = getFromBase(state),
    fromNumber = getFromNumber(state),
    toBase = getToBase(state),
    toNumber = getToNumber(state);

  return (
    <div>
      {tabs}

      <span>From:</span><CopyToClipboard from="base_number_to"/>
      <div className={styles.wrap}>
        <TextBox className={cc([styles.number, { [styles.error]: errors.fromNumber }])} id="base_number_from" autofocus onChange={actions.base.fromNumber} value={fromNumber} />
        <TextBox className={styles.base} onChange={actions.base.fromBase} type="number" value={fromBase} min={2} max={36}/>
      </div>

      <span>To:</span><CopyToClipboard from="base_number_to"/>
      <div className={styles.wrap}>
        <TextBox className={cc([styles.number, { [styles.error]: errors.toNumber }])} id="base_number_to" onChange={actions.base.toNumber} value={toNumber}/>
        <TextBox className={styles.base} onChange={actions.base.toBase} type="number" value={toBase} min={2} max={36}/>
      </div>
    </div>
  );
}