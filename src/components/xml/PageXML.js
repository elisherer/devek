import { h } from 'hyperapp';
import TextBox from '../TextBox';
import TextArea from '../TextArea';
import { getXML, getXPath, getXPathEnabled } from './actions';
import {getXMLDoc, prettifyXml, queryXPath} from "./xml";
import Checkbox from "../Checkbox";

let xmlDocSource, xmlDoc;

export default () => (state, actions) => {

  const input = getXML(state),
    xpath = getXPath(state),
    xpathEnabled = getXPathEnabled(state);

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
  if (xmlDoc && !error) {
    try{
      if (xpathEnabled) {
        const xPathEesult = queryXPath(xmlDoc, xpath);
        results = [];
        let node;
        while ((node = xPathEesult.iterateNext())) {
          results.push(node.outerHTML);
        }
      } else {
        results = prettifyXml(xmlDoc);
      }
    }
    catch (e) {
      error = e.message;
    }
  }

  let resultsNode;

  if (!error) {
    if (!xpathEnabled) {
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
    <div>
      <label>XML:</label>
      <TextArea autofocus onChange={actions.xml.xml} value={input}/>

      <Checkbox label="Use XPath" checked={xpathEnabled} onchange={actions.xml.xpathToggle} />
      {xpathEnabled && <label>XPath expression:</label>}
      {xpathEnabled && <TextBox value={xpath} onChange={actions.xml.xpath}/>}

      <h1>Result</h1>
      {error ? <p style={{color:'red'}}>{error}</p> : resultsNode}
    </div>
  );
}