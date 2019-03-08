const rgbaRegex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*(\d*(?:\.\d+)?))?\)$/;
const hexRegex = /^#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})$|^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;

const RGBA = (r,g,b,a) => ({r,g,b,a});

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
  }
};
const formatters = {
  rgba: c => `rgb${c.a < 1 ? 'a' : ''}(${c.r}, ${c.g}, ${c.b}${c.a < 1 ? ', ' + c.a : ''})`,
  hex: c => '#' + (c.r < 16 ? '0' : '') + c.r.toString(16) + (c.g < 16 ? '0' : '') + c.g.toString(16) + (c.b < 16 ? '0' : '') + c.b.toString(16),
};

const allFields = ['rgba', 'hex'];


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