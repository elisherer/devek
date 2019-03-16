const rgbaRegex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*(\d*(?:\.\d+)?))?\)$/,
  hslaRegex = /^hsla?\((-?\d+|-?\d+\.\d+),\s*(\d+|-?\d+\.\d+)%,\s*(\d+|-?\d+\.\d+)%(,\s*(\d*(?:\.\d+)?))?\)$/,
  hexRegex = /^#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})$|^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;

const RGBA = (r,g,b,a) => ({r,g,b,a});

const hue2rgb = (p, q, t) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
};

const parsers = {
  rgba: str => {
    const match = str.match(rgbaRegex);
    if (!match) return null;
    let r = Number(match[1]), g = Number(match[2]), b = Number(match[3]), a = Number(match[5]);
    if (r > 255 || g > 255 || b > 255 || a > 1) return null;
    return RGBA(r,g,b,a || 1);
  },
  hex: str => {
    const match = str.match(hexRegex);
    if (!match) return null;
    let r = parseInt(match[1].length === 1 ? (match[1] + match[1]) : match[1] || (match[4] + match[4]), 16),
      g = parseInt(match[2].length === 1 ? (match[2] + match[2]) : match[2] || (match[5] + match[5]), 16),
      b = parseInt(match[3].length === 1 ? (match[3] + match[3]) : match[3] || (match[6] + match[6]), 16);
    return RGBA(r,g,b,1);
  },
  hsla: str => {
    const match = str.match(hslaRegex);
    if (!match) return null;
    let h = Number(match[1]), s = Number(match[2]), l = Number(match[3]), a = Number(match[5]);
    h = (h % 360) / 360;
    s = s / 100;
    l = l / 100;
    if (s === 0) {
      return RGBA(l,l,l,a || 1);
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return RGBA(
      Math.round(hue2rgb(p, q, h + 1/3) * 255), 
      Math.round(hue2rgb(p, q, h) * 255), 
      Math.round(hue2rgb(p, q, h - 1/3) * 255),
      a || 1);
  }
};
const formatters = {
  rgba: c => `rgb${c.a < 1 ? 'a' : ''}(${c.r}, ${c.g}, ${c.b}${c.a < 1 ? ', ' + c.a : ''})`,
  hex: c => '#' + (c.r < 16 ? '0' : '') + c.r.toString(16) + (c.g < 16 ? '0' : '') + c.g.toString(16) + (c.b < 16 ? '0' : '') + c.b.toString(16),
  hsla: c => {
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min){
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = (h * 360).toFixed(2), s = (s * 100).toFixed(2), l = (l * 100).toFixed(2);
    return `hsl${c.a < 1 ? 'a' : ''}(${h}, ${s}%, ${l}%${c.a < 1 ? ', ' + c.a : ''})`;
  }
};

const allFields = ['rgba', 'hex', 'hsla'];


export const reduceBy = (field, fields) => {
  const newState = { ...fields, errors: { ...fields.errors }};

  // calc new field (and determine if is valid)
  const parsedValue = parsers[field](fields[field]);
  const invalid = parsedValue === null;

  // if the new value is valid, then calc the others fields new values
  const otherFields = allFields.filter(x => x !== field);
  if (!invalid) {
    newState.parsed = parsedValue;
    otherFields.forEach(otherField => {
      newState[otherField] = formatters[otherField](parsedValue);
      newState.errors[otherField] = false;
    });
  }

  newState.errors[field] = invalid;

  return newState;
};