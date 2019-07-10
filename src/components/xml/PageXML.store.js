import createStore from "../../helpers/createStore";
import {XMLParse, XMLserialize} from './xml';

const actionCreators = {
  xml: e => state => ({ ...state, xmlInput: e.target.innerText }),
  xpathEnabled: e => state => ({ ...state, xpathEnabled: e.target.checked }),
  xpath: e => state => ({ ...state, xpath: e.target.value, }),
  xslt: e => state => ({ ...state, xslt: e.target.innerText }),
  applyXSLT: () => state => {
    try {
      const xml = XMLParse(state.xmlInput),
        xslt = XMLParse(state.xslt);
      const processor = new XSLTProcessor();
      processor.importStylesheet(xslt);
      const result = processor.transformToDocument(xml);
      return { ...state, xsltResult: result ? XMLserialize(result) : '<!-- No result -->', error: '' };
    }
    catch (e) {
      return { ...state, xsltResult: '', error: e.name + ': ' + e.message };
    }
  }
};

const initialState = {
  xmlInput: '<root><record>one</record><record>two</record></root>',
  xpathEnabled: false,
  xpath: '/*',
  xslt: `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="yes"/>
  <xsl:strip-space elements="*"/>
  <xsl:template match="/">
    <xsl:copy-of select="."/>
  </xsl:template>
</xsl:stylesheet>`,
  xsltResult: '',
  error: ''
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'xml');