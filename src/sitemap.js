export const siteMap = {
  "/": {
    keyword: 'home',
    title: 'Home',
    header: 'Developer Kit',
    description: 'Home'
  },
  "/text": {
    keyword: 'text',
    title: 'Text',
    header: 'Text Conversion',
    description: "Converting Case, Encodings (URL, HTML, Base64)",
    children: {
      "/case": {
        keyword: 'case',
        title: "Case Conversion",
        description: "Uppercase, lowercase and capitalize"
      },
      "/url": {
        keyword: 'url',
        title: "URL Encoding",
        description: 'encode and decode',
      },
      "/html": {
        keyword: 'html',
        title: "HTML Encoding",
        description: 'encode and decode',
      }
    }
  },
  "/base": {
    keyword: 'base',
    title: 'Base',
    header: 'Base Conversion',
    description: "Convert between bases"
  },
  "/regex": {
    keyword: 'regex',
    title: 'RegEx',
    header: 'RegEx Tester',
    description: "Regular expression testing"
  },
  "/json": {
    keyword: 'json',
    title: 'JSON',
    header: 'JSON Debugger/Prettifier',
    description: "Debug, Prettify"
  },
  "/xml": {
    keyword: 'xml',
    title: 'XML',
    header: 'XML Debugger/Prettifier',
    description: "XML Prettify and XPath query"
  },
  "/jwt": {
    keyword: 'jwt',
    title: 'JWT',
    header: 'JWT Tool',
    description: "Decode, Verify & Encode"
  },
  "/time": {
    keyword: 'time',
    title: 'Time',
    header: 'Time tools',
    description: "See world time and do conversions"
  },
  "/random": {
    keyword: 'random',
    title: 'Random',
    header: 'Random Generator',
    description: "Generate Random passwords, numbers, etc",
    children: {
      "/password": {
        keyword: 'password',
        title: "Passwords",
        description: "Generate passwords"
      },
      "/guid": {
        keyword: 'guid',
        title: "GUID",
        description: 'Generate unique ids',
      },
    }
  },
  //hash: { title: 'Hash', component: NotFound},
  //img: { title: 'Image', component: NotFound},
  "/color": {
    keyword: 'color',
    title: 'Color',
    header: 'Color Conversion',
    description: 'Convert between color '
  },
};

export const flatMap = Object.keys(siteMap).reduce((a,c) => {
  a[c] = siteMap[c];
  if (siteMap[c].children) {
    Object.keys(siteMap[c].children).forEach(path => {
      const child = siteMap[c].children[path];
      a[c + path] = {
        ...siteMap[c],
        ...child,
        title: siteMap[c].title + ' / ' + child.title,
      };
    });
    a[c].parent = true;
  }
  
  return a;
}, {});
