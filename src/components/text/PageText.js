import { h } from 'hyperapp';
import cc from 'classcat';
import Card from '../Card';
import { getInput } from '../../actions/text';
import { Redirect, Link } from '@hyperapp/router';
import styles from './PageText.less';
import { textCategories, textFunctions } from "./text";

function stripFormattingOnPaste(e) {
  const cbData = (e.originalEvent && e.originalEvent.clipboardData) || e.clipboardData;
  if (cbData && cbData.getData) {
    e.preventDefault();
    const plainText = cbData.getData('text/plain');
    window.document.execCommand('insertText', false, plainText);
  }
}

export default ({ location, match }) => (state, actions) => {
  const input = getInput(state);

  const pathSegments = location.pathname.substr(1).split('/');

  const category = pathSegments[1];
  if (!category) {
    const firstTextFunc = Object.keys(textFunctions[textCategories[0].category])[0];
    return <Redirect to={`/${pathSegments[0]}/${textCategories[0].category}/${firstTextFunc}`}/>;
  }
  const ctc = textCategories.find(c => c.category === category);

  const textFunc = pathSegments[2];
  if (!textFunc) {
    const firstTextFunc = Object.keys(textFunctions[category])[0];
    return <Redirect to={`/${pathSegments[0]}/${category}/${firstTextFunc}`}/>;
  }

  let output, error = null;
  const ctf = textFunctions[category][textFunc];
  try {
    output = ctf.func(input);
  }
  catch (e) {
    error = e.message;
  }

  const cardHeader = (
    <div className={styles.functions}>
      {
        Object.keys(textFunctions[category]).map(tf =>{
          return (
            <Link className={cc({[styles.active]: tf === textFunc})} to={"/" + pathSegments[0] + "/" + pathSegments[1] + "/" + tf}>{textFunctions[category][tf].title}</Link>
          );
        })
      }
    </div>
  );

  return (
    <div className={styles.page}>

      <nav className={styles.categories}>
        {textCategories.map(c => {
          return (
            <Link className={cc({[styles.active]: c.category === category})} to={"/" + pathSegments[0] + '/' + c.category}>{c.title}</Link>
          );
        })}
      </nav>

      <Card header={cardHeader}>

        <label>Input:</label>
        <section className={styles.textarea}>
          <pre contentEditable oninput={actions.text.set} onpaste={stripFormattingOnPaste}/>
        </section>
        <div className={styles.input_info}>
          <sup>Length: {input.length}</sup>
        </div>

        <label>Output:</label>
        <section className={cc([styles.textarea, styles.readonly])}>
          <pre style={ctf.style} className={cc({[styles.error]: error})} innerText={error || output} />
        </section>
        <div className={styles.input_info}>
          <sup innerHTML={!error && output.length > 0 ? "Length: " + output.length : "&nbsp;"} />
        </div>
      </Card>

  </div>
  );
}