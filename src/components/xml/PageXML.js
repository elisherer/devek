import { h } from 'hyperapp';
import cc from 'classcat';
import Card from '../Card';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import { getInput, getXPath } from 'actions/xml';
import { Redirect, Link } from '@hyperapp/router';
import {getXMLDoc, prettifyXml, queryXPath} from "./xml";
import styles from './PageXML.less';

let xmlDocSource, xmlDoc;

export default ({ location, match }) => (state, actions) => {
  const pathSegments = location.pathname.substr(1).split('/');

  const func = pathSegments[1];
  if (!func) {
    return <Redirect to={`/${pathSegments[0]}/xpath`}/>;
  }

  const prettify = func === "prettify";

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
  if (xmlDoc && !error && prettify) {
    try{
      results = prettifyXml(xmlDoc);
    }
    catch (e) {
      error = e.message;
    }
  }
  else if (xmlDoc && !error && xpath) {
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

  let resultsNode;

  if (!error) {
    if (prettify) {
      resultsNode = <TextArea readonly value={results}
                              html={!!results && results.includes('<parsererror')}/>
    }
    else {
      resultsNode = !results || !results.length
        ? <p>No results yet</p>
        : results.map(result =>
          <TextArea readonly value={result}
                    html={!!result && result.includes('<parsererror')} />
        );
    }
  }

  return (
    <div className={styles.page}>
      <Card header={cardHeader}>

        <label>XML:</label>
        <TextArea autofocus onChange={actions.xml.set}/>

        {!prettify && <label>XPath expression:</label>}
        {!prettify && <TextBox value={xpath} onChange={actions.xml.xpath}/>}
      </Card>

      <Card title="Result">
        {error ? <p className={styles.error}>{error}</p> : resultsNode}
      </Card>
  </div>
  );
}