import { h } from 'hyperapp';
import cc from 'classcat';
import Card from '../Card';
import stripFormattingOnPaste from 'helpers/stripFormattingOnPaste';
import { getInput, getXPath } from 'actions/xml';
import { Redirect, Link } from '@hyperapp/router';
import { getXMLDoc, queryXPath } from "./xml";
import styles from './PageXML.less';

let xmlDocSource, xmlDoc;

export default ({ location, match }) => (state, actions) => {
  const pathSegments = location.pathname.substr(1).split('/');

  const func = pathSegments[1];
  if (!func) {
    return <Redirect to={`/${pathSegments[0]}/xpath`}/>;
  }

  const input = getInput(state),
    xpath = getXPath(state);

  let results, error = null;
  if (!input) {
    xmlDocSource = input;
    xmlDoc = null;
  }
  if (input && input !== xmlDocSource) {
    xmlDocSource = input;
    try {
      xmlDoc = getXMLDoc(input);
    }
    catch (e) {
      error = e.message;
    }
  }
  if (xmlDoc && !error && xpath) {
    try {
      const xPathEesult = queryXPath(xmlDoc, xpath);
      results = [];
      let node;
      while ((node = xPathEesult.iterateNext())) {
        results.push(node.outerHTML);
      }
    }
    catch (e) {
      error = e.message;
    }
  }

  const cardHeader = (
    <div className={styles.tabs}>
      <Link className={cc({[styles.active]: func === 'xpath'})} to={"/" + pathSegments[0] + "/xpath"}>XPath</Link>
      <Link className={cc({[styles.active]: func === 'prettify'})} to={"/" + pathSegments[0] + "/prettify"}>Prettify</Link>
    </div>
  );

  return (
    <div className={styles.page}>
      <Card header={cardHeader}>

        <label>XML:</label>
        <section className={styles.textarea}>
          <pre contentEditable oninput={actions.xml.set} onpaste={stripFormattingOnPaste}/>
        </section>

        <label>XPath expression:</label>
        <section className={styles.textbox}>
          <input value={xpath} oninput={actions.xml.xpath}/>
        </section>

        <label>Results:</label>
        {error || !results || !results.length ? (
          <section className={cc([styles.textarea, styles.readonly])}>
            <pre className={cc({[styles.error]: error})} innerText={error || "No results yet"} />
          </section>
          )
          : results.map(result => (
            <section className={cc([styles.textarea, styles.readonly])}>
              {result && result.includes('<parsererror') ? <pre innerHTML={result} /> : <pre innerText={result} /> }
            </section>
          ))
        }

      </Card>

  </div>
  );
}