import React from 'react';
import { Checkbox, CopyToClipboard, TextArea, TextBox } from '../_lib';
import { useStore, actions } from './PageXML.store';
import {getXMLDoc, prettifyXml, queryXPath} from "./xml";

let xmlDocSource, xmlDoc;

const PageXML = () => {
  const state = useStore();

  const {
    xml: input,
    xpath,
    xpathEnabled
  } = state;

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
      resultsNode = (
        <>
          <CopyToClipboard from="xml_result"/>
          <TextArea id="xml_result" readOnly value={results}
                  html={!!results && results.includes('<parsererror')}/>
        </>
      );
    }
    else {
      resultsNode = !results || !results.length
        ? <p>No results yet</p>
        : results.map((result, i) =>
          <React.Fragment key={i}>
            <CopyToClipboard from={`xml_result_${i}`}/>
            <TextArea id={`xml_result_${i}`} readOnly value={result}
                    html={!!result && result.includes('<parsererror')} />
          </React.Fragment>
        );
    }
  }

  return (
    <div>
      <label>XML:</label>
      <TextArea autoFocus onChange={actions.xml} value={input}/>

      <Checkbox label="Use XPath" checked={xpathEnabled} onChange={actions.xpathToggle} />
      {xpathEnabled && <label>XPath expression:</label>}
      {xpathEnabled && <TextBox value={xpath} onChange={actions.xpath}/>}

      <h1>Result</h1>
      {error ? <p style={{color:'red'}}>{error}</p> : resultsNode}
    </div>
  );
};

export default PageXML;