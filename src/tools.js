import PageText from "./components/text/PageText";
import PageRegex from "./components/regex/PageRegex";
//import NotFound from "./components/NotFound";
import PageJWT from "./components/jwt/PageJWT";
import PageXML from "./components/xml/PageXML";
import PageJSON from "./components/json/PageJSON";

const tools = {
  text: { title: 'Text', component: PageText, description: "Case, Encodings (URL, HTML, Base64)" },
  regex: { title: 'RegEx', component: PageRegex, description: "Regular expression testing"  },
  json: { title: 'JSON', component: PageJSON, description: "Debug, Prettify" },
  xml: { title: 'XML', component: PageXML, description: "XML Prettify and XPath query"},
  jwt: { title: 'JWT', component: PageJWT, description: "Decode, Verify & Encode"},
  //rand: { title: 'Random', component: NotFound},
  //hash: { title: 'Hash', component: NotFound},
  //img: { title: 'Image', component: NotFound},
  //color: { title: 'Color', component: NotFound},
};

export default tools;
