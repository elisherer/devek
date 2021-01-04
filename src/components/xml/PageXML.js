import { Fragment } from "react";
import { Redirect } from "react-router-dom";
import { Checkbox, CopyToClipboard, TextArea, TextBox } from "../_lib";
import { useStore, actions } from "./PageXML.store";
import { XMLParse, prettifyXml, queryXPath } from "./xml";

let xmlDocSource, xmlDoc;
const pageRoutes = ["", "transform"];

const PageXML = ({ location }: { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || "")) {
    return <Redirect to={"/" + pathSegments[0] + "/" + pageRoutes[0]} />;
  }

  const state = useStore();

  if (!type) {
    const { xmlInput, xpath, xpathEnabled } = state;

    let results,
      error = null;
    if (!xmlInput) {
      xmlDocSource = xmlInput;
      xmlDoc = null;
    }
    if (xmlInput && xmlInput !== xmlDocSource) {
      xmlDocSource = xmlInput;
      try {
        xmlDoc = XMLParse(xmlInput);
      } catch (e) {
        error = e.message;
      }
    }
    if (xmlDoc && !error) {
      try {
        if (xpathEnabled) {
          const xPathResult = queryXPath(xmlDoc, xpath);
          results = [];
          let node;
          while ((node = xPathResult.iterateNext())) {
            results.push(node.nodeName === "#text" ? node.textContent : node.outerHTML);
          }
        } else {
          results = prettifyXml(xmlDoc);
        }
      } catch (e) {
        error = e.message;
      }
    }

    let resultsNode;

    if (!error) {
      if (!xpathEnabled) {
        resultsNode = (
          <>
            <CopyToClipboard from="xml_result" />
            <TextArea
              id="xml_result"
              readOnly
              lineNumbers
              value={results}
              html={!!results && results.includes("<parsererror")}
            />
          </>
        );
      } else {
        resultsNode =
          !results || !results.length ? (
            <p>No results yet</p>
          ) : (
            results.map((result, i) => (
              <Fragment key={i}>
                <CopyToClipboard from={`xml_result_${i}`} />
                <TextArea
                  id={`xml_result_${i}`}
                  readOnly
                  value={result}
                  html={!!result && result.includes("<parsererror")}
                />
              </Fragment>
            ))
          );
      }
    }

    return (
      <div>
        <label>XML:</label>
        <TextArea autoFocus onChange={actions.xml} value={xmlInput} />

        <Checkbox label="Use XPath" checked={xpathEnabled} onChange={actions.xpathEnabled} />
        {xpathEnabled && <label>XPath expression:</label>}
        {xpathEnabled && <TextBox value={xpath} onChange={actions.xpath} />}

        <h1>Result</h1>
        {error ? <p style={{ color: "red" }}>{error}</p> : resultsNode}
      </div>
    );
  } else if (type === "transform") {
    const { xmlInput, xslt, xsltResult, error } = state;

    return (
      <div>
        <label>XML:</label>
        <TextArea autoFocus onChange={actions.xml} value={xmlInput} />

        <label>XSLT:</label>
        <TextArea onChange={actions.xslt} value={xslt} />

        <button onClick={actions.applyXSLT}>Apply</button>

        <h1>Result</h1>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <CopyToClipboard from="xml_xslt_result" />
            <TextArea
              id="xml_xslt_result"
              readOnly
              lineNumbers
              value={xsltResult}
              html={
                !!xsltResult &&
                (xsltResult.includes("<parsererror") || xsltResult.includes("<html"))
              }
            />
          </>
        )}
      </div>
    );
  }
};

export default PageXML;
