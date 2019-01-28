import PageText from "./components/text/PageText";
import PageRegex from "./components/regex/PageRegex";
//import NotFound from "./components/NotFound";
import PageJWT from "./components/jwt/PageJWT";
import PageXML from "./components/xml/PageXML";
import PageJSON from "./components/json/PageJSON";
import PageRandom from "./components/random/PageRandom";

const tools = {
  text: { title: 'Text', header: 'Text Encoder/Decoder', component: PageText, description: "Case, Encodings (URL, HTML, Base64)" },
  regex: { title: 'RegEx', header: 'RegEx Tester', component: PageRegex, description: "Regular expression testing"  },
  json: { title: 'JSON', header: 'JSON Debugger', component: PageJSON, description: "Debug, Prettify" },
  xml: { title: 'XML', header: 'XML Debugger', component: PageXML, description: "XML Prettify and XPath query"},
  jwt: { title: 'JWT', header: 'JWT Tool', component: PageJWT, description: "Decode, Verify & Encode"},
  rand: { title: 'Random', header: 'Random Generator', component: PageRandom, description: "Generate Random passwords, numbers, etc"},
  //hash: { title: 'Hash', component: NotFound},
  //img: { title: 'Image', component: NotFound},
  //color: { title: 'Color', component: NotFound},
};

export default tools;
