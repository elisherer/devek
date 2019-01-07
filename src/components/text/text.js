const spanEl = document.createElement('span');
const areaEl = document.createElement('textarea');

const textFunctions = {
  uppercase: { title: 'Uppercase', button: 'UPPER', func: input => input.toUpperCase() },
  urlencode: { title: 'URL Encode', button: 'Encode', func: input => encodeURIComponent(input)  },
  htmlencode: { title: 'HTML Encode', button: 'Encode', func: input => { spanEl.textContent = input; return spanEl.innerHTML; }},
  base64encode: { title: 'Base64 Encode', button: 'Encode', func: input => btoa(input) },
  base36encode: { title: 'Base36 Encode', button: 'Encode', func: input => parseInt(input, 36) },

  lowercase: { title: 'Lowercase', button: 'lower', func: input => input.toLowerCase() },
  urldecode: { title: 'URL Decode', button: 'Decode', func: input => decodeURIComponent(input)  },
  htmldecode: { title: 'HTML Decode', button: 'Decode', func: input => { areaEl.innerHTML = input; return areaEl.value; }},
  base64decode: { title: 'Base64 Decode', button: 'Decode', func: input => atob(input) },
  base36decode: { title: 'Base36 Decode', button: 'Decode', func: input => parseInt(input).toString(36) },
};

export default textFunctions;