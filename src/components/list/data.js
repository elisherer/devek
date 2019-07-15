// Split -> Map -> Filter -> Reduce / Join

const sorts = {
  NumberAsc: (a, b) => a - b,
  NumberDesc: (a, b) => b - a,
  TextDesc: (a, b) => b.localeCompare(a),
  TextAsc: (a, b) => a.localeCompare(b),
};

const parseArrayOrString = input => Array.isArray(input) ? input : [input];
const parseString = input => input.length === 2 && input[0] === '\\' ? JSON.parse('"' + input + '"') : input;

const actions = {

  "Split": {
    input: String,
    output: Array,
    parameters: { by: 'string' },
    func: (input, by) => input.split(parseString(by)),
  },

  "Wrap": {
    input: [Array, String],
    output: Array,
    parameters: { prefix: 'string', suffix: 'string' },
    func: (input, prefix, suffix) => parseArrayOrString(input).map(x => prefix + x + suffix),
  },

  "Replace": {
    input: [Array, String],
    output: Array,
    parameters: { pattern: 'string', flags: 'string', replace: 'string' },
    func: (input, pattern, flags, replace) => {
      const regexp = new RegExp(pattern, flags);
      return parseArrayOrString(input).map(x => x.replace(regexp, replace));
    },
  },

  "Filter": {
    input: [Array, String],
    output: Array,
    parameters: { pattern: 'string', flags: 'string' },
    func: (input, pattern, flags) => {
      const regexp = new RegExp(pattern, flags);
      return parseArrayOrString(input).filter(x => regexp.test(x));
    },
  },

  "Remove Empty": {
    input: [Array, String],
    output: Array,
    parameters: null,
    func: array => array.filter(Boolean),
  },

  "Sort": {
    input: [Array, String],
    output: Array,
    parameters: { by: ["Text", "Number"], order: ["Asc", "Desc"] },
    func: (input, type, order) => parseArrayOrString(input).sort(sorts[type + order]),
  },

  "Join": {
    input: [Array, String],
    output: String,
    parameters: { with: 'string' },
    func: (input, by) => parseArrayOrString(input).join(parseString(by)),
  },

  "Concat": {
    input: [Array, String],
    output: String,
    parameters: null,
    func: input => parseArrayOrString(input).reduce((a,c) => a + c, ''),
  },

  "Sum": {
    input: [Array, String],
    output: Number,
    parameters: null,
    func: input => parseArrayOrString(input).reduce((a,c) => a + c, 0),
    last: true,
  },

};

export {
  actions
};