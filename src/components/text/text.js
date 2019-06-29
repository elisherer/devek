const spanEl = document.createElement('span');
const areaEl = document.createElement('textarea');

const textCategories = [
  { category: "case", title: 'Case' },
  { category: "url", title: 'URL' },
  { category: "html", title: 'HTML' },
  //{ category: "base64", title: 'Base64' },
  //{ category: "base36", title: 'Base36' },
];

const textFunctions = {
  case: {
    uppercase: { title: 'Uppercase', func: input => input, style: { textTransform: 'uppercase'} },//input => input.toUpperCase() },
    lowercase: { title: 'Lowercase', func: input => input, style: { textTransform: 'lowercase'} },//input => input.toLowerCase() },
    capitalize: { title: 'Capitalize', func: input => input, style: { textTransform: 'capitalize'} },
  },
  url: {
    encode: { title: 'Encode', func: input => encodeURIComponent(input)  },
    decode: { title: 'Decode', func: input => decodeURIComponent(input)  },
  },
  html: {
    encode: { title: 'Encode', func: input => { spanEl.textContent = input; return spanEl.innerHTML; }},
    decode: { title: 'Decode', func: input => { areaEl.innerHTML = input; return areaEl.value; }},
  },
};

export {
  textCategories,
  textFunctions,
};