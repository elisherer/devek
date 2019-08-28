// Split -> Map -> Filter -> Reduce / Join

const sorts = {
  NumberAsc: (a, b) => a - b,
  NumberDesc: (a, b) => b - a,
  TextDesc: (a, b) => b.localeCompare(a),
  TextAsc: (a, b) => a.localeCompare(b),
};

const parseArrayOrString = input => Array.isArray(input) ? input : [input];
const parseString = input => input.length === 2 && input[0] === '\\' ? JSON.parse('"' + input + '"') : input;

const flat = array => [].concat(...array);

const removeNewLines = x => x.replace(/\n/g, '');

// Each action is of the form Func<Array|String> -> Array|String
const actions = {

  "Split": {
    description: "Split each item (as string) by a specified separator",
    parameters: { By: 'string' },
    defaults: { By: '' },
    func: (input, { By }) => flat(parseArrayOrString(input).map(x => x.split(parseString(By)))),
  },

  "Wrap": {
    description: "Wrap each item with a prefix and suffix (e.g. quotes, commas, etc)",
    parameters: { Prefix: 'string', Suffix: 'string' },
    defaults: { Prefix: '', Suffix: '' },
    func: (input, { Prefix, Suffix }) => parseArrayOrString(input).map(x => Prefix + x + Suffix),
  },

  "Replace": {
    description: "Replace each item using a regular expression and substitution expression",
    parameters: { Pattern: 'string', Flags: [ "g", "gm", "gi", "gmi", "m", "mi", "i"], Substitution: 'string' },
    defaults: { Pattern: '', Flags: 'gi', Substitution: ''},
    func: (input, { Pattern, Flags, Substitution }) => {
      const regexp = new RegExp(Pattern, Flags);
      return parseArrayOrString(input).map(x => x.replace(regexp, Substitution));
    },
  },

  "Filter": {
    description: "Filter items that do/don't match the specified regular expression",
    parameters: { Pattern: 'string', Flags: [ "g", "gm", "gi", "gmi", "m", "mi", "i"], Remove: ["Matching", "Non Matching"] },
    defaults: { Pattern: '', Flags: 'gi', Remove: 'Matching'},
    func: (input, { Pattern, Flags, Remove }) => {
      const regexp = new RegExp(Pattern, Flags);
      const removeMatching = Remove === 'Matching';
      return parseArrayOrString(input).filter(x => removeMatching ? !regexp.test(x) : regexp.test(x));
    },
  },

  "Remove Empty": {
    description: "Remove items that have a falsy value (e.g. '', null, etc)",
    parameters: null,
    func: input => parseArrayOrString(input).filter(Boolean),
  },

  "Remove New-Lines": {
    description: "Remove \\n & \\r from strings",
    parameters: null,
    func: input => parseArrayOrString(input).map(removeNewLines),
  },

  "Sort": {
    description: "Sort the items by a specified type and order",
    parameters: { Type: ["Text", "Number"], Order: ["Asc", "Desc"] },
    defaults: { Type: "Text", Order: "Asc" },
    func: (input, { Type, Order }) => parseArrayOrString(input).sort(sorts[Type + Order]),
  },

  "Join": {
    description: "Join all items with a specified separator",
    parameters: { With: 'string' },
    defaults: { With: "" },
    func: (input, { With }) => parseArrayOrString(input).join(parseString(With)),
  },

  "Concat": {
    description: "Concat all items as strings",
    parameters: null,
    func: input => parseArrayOrString(input).reduce((a,c) => a + c, ''),
  },

  "Sum": {
    description: "Summarize all items as numbers",
    parameters: null,
    func: input => parseArrayOrString(input).reduce((a,c) => a + Number(c), 0).toString(),
  },

  "Product": {
    description: "Multiply all items as numbers",
    parameters: null,
    func: input => parseArrayOrString(input).reduce((a,c) => a * c, 1).toString(),
  },

};

export {
  actions
};