const sitemap = {
  "/text": {
    name: 'text',
    title: 'Text',
    header: 'Text Encoder/Decoder',
    description: "Case, Encodings (URL, HTML, Base64)",
    children: {
      "case": {
        title: "Case"
      },
      "url": {
        title: "URL"
      },
      "html": {
        title: "HTML"
      }
    }
  },
  "/base": {
    name: 'base',
    title: 'Base',
    header: 'Base Conversion',
    description: "Convert between bases"
  },
  "/regex": {
    name: 'regex',
    title: 'RegEx',
    header: 'RegEx Tester',
    description: "Regular expression testing"
  },
  "/json": {
    name: 'json',
    title: 'JSON',
    header: 'JSON Debugger',
    description: "Debug, Prettify"
  },
  "/xml": {
    name: 'xml',
    title: 'XML',
    header: 'XML Debugger',
    description: "XML Prettify and XPath query"
  },
  "/jwt": {
    name: 'jwt',
    title: 'JWT',
    header: 'JWT Tool',
    description: "Decode, Verify & Encode"
  },
  "/random": {
    name: 'random',
    title: 'Random',
    header: 'Random Generator',
    description: "Generate Random passwords, numbers, etc"
  },
  //hash: { title: 'Hash', component: NotFound},
  //img: { title: 'Image', component: NotFound},
  //color: { title: 'Color', component: NotFound},
};

export default sitemap;
