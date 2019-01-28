import { h } from 'hyperapp';
import cc from 'classcat';
import Card from '../Card';
import TextArea from '../TextArea';
import Tabs from '../Tabs';
import Radio from '../Radio';
import CopyToClipboard from '../CopyToClipboard';
import { getInput } from 'actions/text';
import { Redirect, Link } from '@hyperapp/router';
import styles from './PageText.less';
import { textCategories, textFunctions } from "./text";

export default ({ location, match }) => (state, actions) => {
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

  const input = getInput(state);
  let output, error = null;
  const ctf = textFunctions[category][textFunc];
  try {
    output = ctf.func(input);
  }
  catch (e) {
    error = e.message;
  }

  return (
    <div className={styles.page}>
      <Card>

        <Radio className={styles.categories}>
          {textCategories.map(c => {
            return (
              <Link data-active={c.category === category}
                    to={"/" + pathSegments[0] + '/' + c.category}>{c.title}</Link>
            );
          })}
        </Radio>

        <Tabs>
          {
            Object.keys(textFunctions[category]).map(tf =>{
              return (
                <Link data-active={tf === textFunc} to={"/" + pathSegments[0] + "/" + pathSegments[1] + "/" + tf}>{textFunctions[category][tf].title}</Link>
              );
            })
          }
        </Tabs>

        <label>Input:</label>
        <TextArea autofocus onChange={actions.text.input} value={input}/>
        <div className={styles.input_info}>
          <sup>Length: {input.length}</sup>
        </div>

        <span>Output:</span><CopyToClipboard from="text-output"/>
        <TextArea id="text-output" readonly
                  className={cc({[styles.error]: error})}
                  style={ctf.style}
                  value={error || output}
        />
        <div className={styles.input_info}>
          <sup innerHTML={!error && output.length > 0 ? "Length: " + output.length : "&nbsp;"} />
        </div>
      </Card>

  </div>
  );
}