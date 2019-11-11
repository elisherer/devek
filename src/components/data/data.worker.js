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

const actions = {
  "Split": (input, { By }) => flat(parseArrayOrString(input).map(x => x.split(parseString(By)))),
  "Wrap": (input, { Prefix, Suffix }) => parseArrayOrString(input).map(x => Prefix + x + Suffix),
  "Replace": (input, { Pattern, Flags, Substitution }) => {
      const regexp = new RegExp(Pattern, Flags.join(''));
      return parseArrayOrString(input).map(x => x.replace(regexp, Substitution));
    },
  "Filter": (input, { Pattern, Flags, Remove }) => {
      const regexp = new RegExp(Pattern, Flags.join(''));
      const filter = Remove === 'Matching' ? x => !regexp.test(x) : x => regexp.test(x);
      return parseArrayOrString(input).filter(filter);
    },
  "Remove Empty": input => parseArrayOrString(input).filter(Boolean),
  "Remove New-Lines": input => parseArrayOrString(input).map(removeNewLines),
  "Sort": (input, { Type, Order }) => parseArrayOrString(input).sort(sorts[Type + Order]),
  "Join": (input, { With }) => parseArrayOrString(input).join(parseString(With)),
  "Concat": input => parseArrayOrString(input).reduce((a,c) => a + c, ''),
  "Sum": input => parseArrayOrString(input).reduce((a,c) => a + Number(c), 0).toString(),
  "Product": input => parseArrayOrString(input).reduce((a,c) => a * c, 1).toString(),
};

onmessage = event => {
  console.log('GOT MSG FROM MAIN');
  const { input, pipe } = event.data;
  const result = pipe.reduce((a, c) => actions[c.action](a, c.parameters), input);
  self.postMessage({ result })
};