import PageText from "./components/text/PageText";
import PageBase from "./components/base/PageBase";
import PageRegex from "./components/regex/PageRegex";
import PageJSON from "./components/json/PageJSON";
import PageXML from "./components/xml/PageXML";
import PageJWT from "./components/jwt/PageJWT";
import PageRandom from "./components/random/PageRandom";
//import NotFound from "./components/NotFound";

const pages = {
  text: PageText,
  base: PageBase,
  regex: PageRegex,
  json: PageJSON,
  xml: PageXML,
  jwt: PageJWT,
  random: PageRandom,
};

export default pages;