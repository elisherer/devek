const parser = new DOMParser();

const getXMLDoc = xml =>
  parser.parseFromString(xml, "text/xml");

const queryXPath = (xmlDoc, xpath) =>
  xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE,  null);

export {
  getXMLDoc,
  queryXPath
};