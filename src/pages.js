import PageText from "./components/text/PageText";
import PageBase from "./components/base/PageBase";
import PageRegex from "./components/regex/PageRegex";
import PageJSON from "./components/json/PageJSON";
import PageXML from "./components/xml/PageXML";
import PageJWT from "./components/jwt/PageJWT";
import PageRandom from "./components/random/PageRandom";
import Home from "./components/Home";
import PageTime from "./components/time/PageTime";
import PageColor from "./components/color/PageColor";
//import NotFound from "./components/NotFound";

const pages = {
  "/": Home,
  "/text": PageText,
  "/base": PageBase,
  "/regex": PageRegex,
  "/json": PageJSON,
  "/xml": PageXML,
  "/jwt": PageJWT,
  "/time": PageTime,
  "/random": PageRandom,
  "/color": PageColor
};

export default pages;