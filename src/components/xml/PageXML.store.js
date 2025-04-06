import createStore from "@/helpers/createStore";
import { transform, XMLserialize, prettifyXSLT } from "./xml";

const actionCreators = {
  xml: e => state => ({ ...state, xmlInput: e.target.innerText }),
  xpathEnabled: e => state => ({ ...state, xpathEnabled: e.target.checked }),
  xpath: e => state => ({ ...state, xpath: e.target.value }),
  xslt: e => state => ({ ...state, xslt: e.target.innerText }),
  applyXSLT: () => state => {
    let xsltResult = "",
      error = "";
    try {
      const result = transform(state.xmlInput, state.xslt);
      xsltResult = result ? XMLserialize(result) : "<!-- No result -->";
    } catch (e) {
      error = e.name + ": " + e.message;
    }
    return { ...state, xsltResult, error };
  },
};

const initialState = {
  xmlInput: "<root><record>one</record><record>two</record></root>",
  xpathEnabled: false,
  xpath: "/*",
  xslt: prettifyXSLT,
  xsltResult: "",
  error: "",
};

export const { actions, useStore } = createStore(actionCreators, initialState, "xml");
