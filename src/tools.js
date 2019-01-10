import PageText from "./components/text/PageText";
import PageRegex from "./components/regex/PageRegex";
import NotFound from "./components/NotFound";
import PageJWT from "./components/jwt/PageJWT";

const tools = {
  text: { title: 'Text', component: PageText },
  regex: { title: 'RegEx', component: PageRegex },
  base64: { title: 'Base64', component: NotFound },
  json: { title: 'JSON', component: NotFound },
  xml: { title: 'XML', component: NotFound},
  jwt: { title: 'JWT', component: PageJWT},
  rand: { title: 'Random', component: NotFound},
  hash: { title: 'Hash', component: NotFound},
  img: { title: 'Image', component: NotFound},
  color: { title: 'Color', component: NotFound},
};

export default tools;
