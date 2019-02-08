const parser = new DOMParser(),
  serializer = new XMLSerializer(),
  xmlMime = "application/xml";

const getXMLDoc = xml => parser.parseFromString(xml, xmlMime);

const queryXPath = (xmlDoc, xpath) =>
  xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE,  null);

const prettifyXSLT = `
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:strip-space elements="*"/>
    <xsl:template match="para[content-style][not(text())]">
      <xsl:value-of select="normalize-space(.)"/>
    </xsl:template>
    <xsl:template match="node()|@*">
      <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>
    </xsl:template>
    <xsl:output indent="yes"/>
  </xsl:stylesheet>`;
let prettifyProcessor;
const getProcessor = () => {
  if (!prettifyProcessor) {
      prettifyProcessor = new XSLTProcessor();
      prettifyProcessor.importStylesheet(getXMLDoc(prettifyXSLT));
  }
  return prettifyProcessor;
};

const prettifyXml = xmlDoc => {
  const resultDoc = getProcessor().transformToDocument(xmlDoc);
  return serializer.serializeToString(resultDoc);
};

export {
  getXMLDoc,
  queryXPath,
  prettifyXml
};