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

import {
  mdiText, // text
  mdiCalculator, // base
  mdiRegex, // regex
  mdiJson, // json
  mdiXml, // xml
  mdiShieldKeyOutline, // jwt
  mdiClockOutline, // time
  mdiImage, // image
  mdiDiceMultipleOutline, // random
  mdiLockOutline, // crypto
  mdiVectorDifference, // diff
  mdiPalette, // color
  mdiLanConnect, // network
  mdiFormatLineStyle, // data
  mdiLink, // url
  mdiHandOkay, // checksum
} from '@mdi/js';

const PageCryptoLazy = lazy(() => import(/* webpackChunkName: "crypto" */'./components/crypto/PageCrypto'));

export const siteMap = {
  "/": {
    component: Home,
    keyword: 'home',
    title: 'Home',
    header: 'Developer Kit',
    description: 'Home',
  },
  "/text": {
    component: PageText,
    keyword: 'text',
    title: 'Text',
    header: "Text Conversion",
    description: "Converting Case, Encodings (URL, HTML, Base64)",
    icon: mdiText,
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
      },
      "/charmap": {
        keyword: 'characters',
        title: "CharMap",
        description: 'Characters map',
      }
    }
  },
  "/base": {
    component: PageBase,
    keyword: 'base',
    title: 'Base',
    header: 'Base Conversion',
    description: "Convert between bases",
    icon: mdiCalculator,
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
    description: "Regular expression testing",
    icon: mdiRegex,
  },
  "/json": {
    component: PageJSON,
    keyword: 'json',
    title: 'JSON',
    header: 'JSON Tools',
    description: "Debug, Prettify",
    icon: mdiJson,
  },
  "/xml": {
    component: PageXML,
    keyword: 'xml',
    title: 'XML',
    header: 'XML Tools',
    description: "Prettify, Query by XPath and Transform",
    icon: mdiXml,
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
    icon: mdiShieldKeyOutline,
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
    header: 'Time Tools',
    description: "See world time and do conversions",
    icon: mdiClockOutline,
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
    header: 'Image Tools',
    description: 'Convert, crop, resize, filter images',
    icon: mdiImage,
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
    icon: mdiDiceMultipleOutline,
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
    header: 'Crypto Tools',
    description: 'Cryptography tools',
    icon: mdiLockOutline,
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
    description: 'Find differences between two texts',
    icon: mdiVectorDifference,
  },
  "/color": {
    component: PageColor,
    keyword: 'color',
    title: 'Color',
    header: 'Color Tools',
    description: 'Convert between different color representations',
    icon: mdiPalette,
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
    header: 'Network Tools',
    description: 'Network information utilities (IP address and more)',
    icon: mdiLanConnect,
  },
  "/data": {
    component: PageData,
    keyword: 'data',
    title: 'Data',
    header: 'Data Tools',
    description: 'Data manipulation tools',
    icon: mdiFormatLineStyle,
  },
  "/url": {
    component: PageURL,
    keyword: 'url',
    title: 'URL',
    header: 'URL Parser',
    description: 'Parse URL to its components',
    icon: mdiLink,
  },
  "/checksum": {
    component: PageChecksum,
    keyword: 'checksum',
    title: 'Checksum',
    header: 'Checksum Tools',
    description: 'Calculate various checksums',
    icon: mdiHandOkay,
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
