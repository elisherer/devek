import React from 'react';
import cx from 'classnames';
import { CopyToClipboard, ChecklistBox, ListBox, Radio, TextArea } from '../_lib';
import { textCategories, textFunctions } from './text';
import { Redirect, NavLink } from 'react-router-dom';

import { useStore, actions } from './PageText.store';
import charmap from './charmap';

const charmapCategories = charmap.map(x=> ({ name: `${x[0]} (${x[1]}-${x[2]})`, value: x[0] }));

import styles from './PageText.less';

const PageText = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');

  const category = pathSegments[1];
  if (!category) {
    const firstTextFunc = Object.keys(textFunctions[textCategories[0].category])[0];
    return <Redirect to={`/${pathSegments[0]}/${textCategories[0].category}/${firstTextFunc}`}/>;
  }

  const textFunc = pathSegments[2];
  if (!textFunc && category !== 'charmap') {
    const firstTextFunc = Object.keys(textFunctions[category])[0];
    return <Redirect to={`/${pathSegments[0]}/${category}/${firstTextFunc}`}/>;
  }

  const state = useStore();

  if (category === 'charmap') {
    const charMap = [];
    charmap.forEach(range => {
      if (state.charmap.categories.includes(range[0])) {
        const submap = [];
        for (let j = range[1]; j <= range[2]; j++) {
          submap.push(<i key={range[0] + j}>{String.fromCodePoint(j)}</i>);
        }
        charMap.push(<div key={range[0]}><h1>{range[0]}</h1>{submap}</div>)
      }
    });
    return <div>
      <div className={styles.charmap}>
        <ChecklistBox label="Select a sub-range:" options={charmapCategories} value={state.charmap.categories} onChange={actions.charmap} maxShowSelection={2}/>
        {charMap}
      </div>
    </div>
  }

  const { input } = state;
  let output, error = null;
  const ctf = textFunctions[category][textFunc];
  try {
    output = input ? ctf.func(input) : '';
  }
  catch (e) {
    error = e.message;
  }

  return (
    <div>
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
      <TextArea autoFocus onChange={actions.input} value={input}/>
      <div className={styles.input_info}>
        <sup>Length: {input.length}</sup>
      </div>

      <span>Output:</span><CopyToClipboard from="text_output"/>
      <TextArea id="text_output" readOnly
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