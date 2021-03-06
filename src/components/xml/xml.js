const parser = new DOMParser(),
	serializer = new XMLSerializer(),
	xmlMime = "application/xml";

const XMLParse = xml => parser.parseFromString(xml, xmlMime);

const XMLserialize = xmlDoc => serializer.serializeToString(xmlDoc);

const queryXPath = (xmlDoc, xpath) =>
	xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);

const prettifyXSLT = `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  <xsl:strip-space elements="*"/>
  <xsl:template match="/">
    <xsl:copy-of select="."/>
  </xsl:template>
</xsl:stylesheet>`;

let prettifyProcessor;
const getProcessor = () => {
	if (!prettifyProcessor) {
		prettifyProcessor = new XSLTProcessor();
		prettifyProcessor.importStylesheet(XMLParse(prettifyXSLT));
	}
	return prettifyProcessor;
};

const prettifyXml = xmlDoc => {
	const resultDoc = getProcessor().transformToDocument(xmlDoc);
	return XMLserialize(resultDoc);
};

const transform = (xml, xslt) => {
	const processor = new XSLTProcessor();
	processor.importStylesheet(XMLParse(xslt));
	return processor.transformToDocument(XMLParse(xml));
};

export {
	prettifyXSLT,
	XMLParse,
	XMLserialize,
	queryXPath,
	prettifyXml,
	transform
};
