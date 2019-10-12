import { lazy } from 'react';

import Home from './components/Home';
import PageText from './components/text/PageText';
import PageBase from './components/base/PageBase';
import PageRegex from './components/regex/PageRegex';
import PageJSON from './components/json/PageJSON';
import PageJWT from './components/jwt/PageJWT';
import PageXML from './components/xml/PageXML';
import PageTime from './components/time/PageTime';
import PageImage from './components/image/PageImage';
import PageRandom from './components/random/PageRandom';
import PageColor from './components/color/PageColor';
import PageNetwork from './components/network/PageNetwork';
//import PageCrypto from './components/crypto/PageCrypto'; // Lazy loaded
import './components/crypto/PageCrypto.less'; // this is to prevent lazy loading of the css file (too small)
import PageDiff from './components/diff/PageDiff'; // Lazy loaded
import PageData from './components/data/PageData';
import PageURL from './components/url/PageURL';
import PageChecksum from './components/checksum/PageChecksum';

const PageCryptoLazy = lazy(() => import(/* webpackChunkName: "crypto" */'./components/crypto/PageCrypto'));

export const siteMap = {
  "/": {
    component: Home,
    keyword: 'home',
    title: 'Home',
    header: 'Developer Kit',
    description: 'Home'
  },
  "/text": {
    component: PageText,
    keyword: 'text',
    title: 'Text',
    header: "Text Conversion",
    description: "Converting Case, Encodings (URL, HTML, Base64)",
    children: {
      "/case": {
        keyword: 'case',
        title: "Case",
        description: "Uppercase, lowercase and capitalize"
      },
      "/url": {
        keyword: 'url',
        title: "URL",
        description: 'encode and decode',
      },
      "/html": {
        keyword: 'html',
        title: "HTML",
        description: 'encode and decode',
      },
      "/convert": {
        keyword: 'convert',
        title: "Conversion",
        description: 'Reverse text etc.',
      }
    }
  },
  "/base": {
    component: PageBase,
    keyword: 'base',
    title: 'Base',
    header: 'Base Conversion',
    description: "Convert between bases",
    children: {
      "/numbers": {
        keyword: 'numbers',
        title: "Numbers",
        description: "Convert between numbers bases"
      },
      "/text": {
        keyword: 'text',
        title: "Text",
        description: 'Convert between text bases',
      },
    }
  },
  "/regex": {
    component: PageRegex,
    keyword: 'regex',
    title: 'RegEx',
    header: 'RegEx Tester',
    description: "Regular expression testing"
  },
  "/json": {
    component: PageJSON,
    keyword: 'json',
    title: 'JSON',
    header: 'JSON Debugger/Prettifier',
    description: "Debug, Prettify"
  },
  "/xml": {
    component: PageXML,
    keyword: 'xml',
    title: 'XML',
    header: 'XML Tools',
    description: "Prettify, Query by XPath and Transform",
    children: {
      "/": {
        keyword: 'xpath',
        title: "Debug and Prettify",
        description: "Debug XML using XPath, and apply prettify"
      },
      "/transform": {
        keyword: 'transform',
        title: "Transform",
        description: "Transform XML using XSLT"
      },
    }
  },
  "/jwt": {
    component: PageJWT,
    keyword: 'jwt',
    title: 'JWT',
    header: 'JWT Tool',
    description: "Decode, Verify & Encode",
    children: {
      "/decode": {
        keyword: 'decode',
        title: "Decoder",
        description: 'Decode and validate JWT',
      },
      "/encode": {
        keyword: 'encode',
        title: "Encoder",
        description: "Generate JWT"
      },
    }
  },
  "/time": {
    component: PageTime,
    keyword: 'time',
    title: 'Time',
    header: 'Time tools',
    description: "See world time and do conversions",
    children: {
      "/now": {
        keyword: 'now',
        title: "Now",
        description: "See current time"
      },
      "/convert": {
        keyword: 'convert',
        title: "Convert",
        description: 'Convert between different time representations',
      },
      "/stopwatch": {
        keyword: 'stopwatch',
        title: "Stopwatch",
        description: 'Stopwatch with laps',
      },
    }
  },
  "/image": {
    component: PageImage,
    keyword: 'image',
    title: 'Image',
    header: 'Image web tools',
    description: 'Convert, crop, resize, filter images',
    children: {
      "/": {
        keyword: 'image',
        title: "Actions",
        description: "Image transformations and extraction"
      },
      "/filters": {
        keyword: 'filters',
        title: "Filters",
        description: "Apply image filters"
      },
      "/crop": {
        keyword: 'crop',
        title: "Crop",
        description: "Image cropping tool"
      },
      "/resize": {
        keyword: 'resize',
        title: "Resize",
        description: 'Resize images',
      },
      "/picker": {
        keyword: 'picker',
        title: "Color Picker",
        description: 'Pick color from an image',
      },
    }
  },
  "/random": {
    component: PageRandom,
    keyword: 'random',
    title: 'Random',
    header: 'Random Generator',
    description: "Generate Random passwords, numbers, etc",
    children: {
      "/password": {
        keyword: 'password',
        title: "Password",
        description: "Generate passwords"
      },
      "/guid": {
        keyword: 'guid',
        title: "Guid",
        description: 'Generate unique ids',
      },
    }
  },
  "/crypto": {
    component: PageCryptoLazy,
    keyword: 'crypto',
    title: 'Crypto',
    header: 'Crypto tools',
    description: 'Cryptography tools',
    children: {
      "/hash": {
        keyword: 'hash',
        title: 'Hash',
        description: 'Generate hash of input text',
      },
      "/cipher": {
        keyword: 'cipher',
        title: "Cipher",
        description: 'Encrypt or decrypt information',
      },
      "/generate": {
        keyword: 'generate',
        title: "Generate Keys",
        description: 'Generate/derive symmetric/asymmetric keys for encryption/signing',
      },
      "/cert": {
        keyword: 'certificate',
        title: "Certificate Parser",
        description: 'Parse PEM (X.509 / ASN.1) certificates',
      },
    }
  },
  "/diff": {
    component: PageDiff,
    keyword: 'diff',
    title: 'Diff',
    header: 'Difference finder',
    description: 'Find differences between two texts'
  },
  "/color": {
    component: PageColor,
    keyword: 'color',
    title: 'Color',
    header: 'Color tools',
    description: 'Convert between different color representations',
    children: {
      "/convert": {
        keyword: 'convert',
        title: 'Conversion',
        description: 'Convert between different color representations',
      },
      "/gradient": {
        keyword: 'gradient',
        title: "Gradient",
        description: 'Create CSS color gradients',
      },
    }
  },
  "/network": {
    component: PageNetwork,
    keyword: 'network',
    title: 'Network',
    header: 'Network tools',
    description: 'Network information utilities (IP address and more)'
  },
  "/data": {
    component: PageData,
    keyword: 'data',
    title: 'Data',
    header: 'Data tools',
    description: 'Data manipulation tools'
  },
  "/url": {
    component: PageURL,
    keyword: 'url',
    title: 'URL',
    header: 'URL parser',
    description: 'Parse URL to its components'
  },
  "/checksum": {
    component: PageChecksum,
    keyword: 'checksum',
    title: 'Checksum',
    header: 'Checksum tools',
    description: 'Calculate various checksums',
    children: {
      "/crc": {
        keyword: 'crc',
        title: "CRC",
        description: "Calculate cyclic redundancy check for a given input"
      },
      "/luhn": {
        keyword: 'luhn',
        title: "Luhn",
        description: "Validate using the Luhn Algorithm (Mod 10)"
      },
    }
  },
};
