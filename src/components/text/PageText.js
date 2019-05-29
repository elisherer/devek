import React, {useReducer} from 'react';
import cx from 'classnames';
import TextArea from '../../lib/TextArea';
import Tabs from '../../lib/Tabs';
import Radio from '../../lib/Radio';
import CopyToClipboard from '../../lib/CopyToClipboard';
import { textCategories, textFunctions } from "./text";
import { initialState, reducer } from './actions';
import { Redirect, NavLink } from 'react-router-dom';

import styles from './PageText.less';

const PageText = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');

  const category = pathSegments[1];
  if (!category) {
    const firstTextFunc = Object.keys(textFunctions[textCategories[0].category])[0];
    return <Redirect to={`/${pathSegments[0]}/${textCategories[0].category}/${firstTextFunc}`}/>;
  }

  const textFunc = pathSegments[2];
  if (!textFunc) {
    const firstTextFunc = Object.keys(textFunctions[category])[0];
    return <Redirect to={`/${pathSegments[0]}/${category}/${firstTextFunc}`}/>;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const { input } = state;
  let output, error = null;
  const ctf = textFunctions[category][textFunc];
  try {
    output = ctf.func(input);
  }
  catch (e) {
    error = e.message;
  }

  return (
    <div>
      <Tabs>
        {textCategories.map(c => (
          <NavLink key={c.category}
                to={"/" + pathSegments[0] + '/' + c.category}>{c.title}</NavLink>
        ))}
      </Tabs>

      <Radio className={styles.funcs}>
        {
          Object.keys(textFunctions[category]).map(tf =>{
            return (
              <NavLink key={tf} to={"/" + pathSegments[0] + "/" + pathSegments[1] + "/" + tf}>{textFunctions[category][tf].title}</NavLink>
            );
          })
        }
      </Radio>

      <label>Input:</label>
      <TextArea autoFocus onChange={e => dispatch({ type: 'input', payload: e.target.innerText })} value={input}/>
      <div className={styles.input_info}>
        <sup>Length: {input.length}</sup>
      </div>

      <span>Output:</span><CopyToClipboard from="text_output"/>
      <TextArea id="text_output" readonly
                className={cx({[styles.error]: error})}
                style={ctf.style}
                value={error || output}
      />
      <div className={styles.input_info}>
        <sup>&nbsp;{!error && output.length > 0 ? "Length: " + output.length : ''}</sup>
      </div>
    </div>
  );
};

export default PageText;