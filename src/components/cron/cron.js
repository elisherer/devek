const SECOND = 'second', MINUTE = 'minute', HOUR = 'hour', DAY = 'day', MONTH = 'month', YEAR = 'year';
const parseWords = {
  [MONTH]: { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 },
  [DAY]: { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 },
};
const aliasWords = {
  [MONTH]: [null,"JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
  [DAY]: ["SUN","MON","TUE","WED","THU","FRI","SAT","SUN"],
};
const ORDINAL = {1:'st',2:'nd',3:'rd',21:'st',22:'nd',23:'rd',31:'st'};
const config = {
  first: { [SECOND]: 0, [MINUTE]: 0, [HOUR]: 0, [DAY]: 0, [DAY+'m']: 1, [MONTH]: 1, [YEAR]: 1993},
  count: { [SECOND]: 60, [MINUTE]: 60, [HOUR]: 24, [DAY]: 7, [DAY+'m']: 31, [MONTH]: 12, [YEAR]: 100},
  names: {
    [MONTH]: [null,"January","February","March","April","May","June","July","August","September","October","November","December"],
    [DAY]: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    [DAY+'m']: Array.from({length:32}).map((_,i)=> i+(ORDINAL[i] || 'th'))
  }
};
const PREDEFINED = {
  "yearly": "0 0 0 1 1 * *",
  "annually": "0 0 0 1 1 * *",
  "monthly":	"0 0 0 1 * * *",
  "weekly":	"0 0 0 * * 0 *",
  "daily": "0 0 0 * * * *",
  "midnight": "0 0 0 * * * *",
  "hourly": "0 0 * * * * *",
  "every_minute": "0 */1 * * * * *",
  "every_second": "* * * * * * *",
};

const parseValue = (value, index, name) => {
  if (value[0] < 10) 
    return parseInt(value, 10);
  const word = value.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(parseWords, name) &&
      Object.prototype.hasOwnProperty.call(parseWords[name], word)) 
    return parseWords[name][word] + (word === 'SUN' && index === 1 ? 7 : 0);
  throw new Error(`Unknown alias ${word} for type ${name}`);
};

const parseField = (name, value) => {
  if (value === '*') {
    return { type: '*' };
  }
  if (/^(\*|\d+)\/\d+$/.test(value)) { // 0/0 , */0
    return { type: '/', args: value.split('/').map(x => x === '*' ? 0 : parseInt(x, 10)) };
  }
  else if (name !== DAY && /^([A-Z]{3}|\d+)-([A-Z]{3}|\d+)$/i.test(value)) { // range only
    return { type: '-', args: value.split('-').map((x, i) => parseValue(x, i, name)) };
  }
  return { 
    type: ',', 
    args: value.split(',').reduce((args, arg) => {
      if (arg.includes('-')) {
        const range = arg.split('-').map(parseValue);
        for (let i = range[0]; i <= range[1]; i++) args.push(i);
      }
      else {
        args.push(parseValue(arg, -1, name));
      }
      return args;
    }, []),
  };
};

const parseDayFields = (dom, dow, quartz) => {
  const o = (quartz && dow === '?') || (dow === '*' && dom !== '*' && dom !== '?') ? 'm' : 'w';
  let parsed;
  if (quartz) {
    switch (o) {
      case 'm':
        if (dom === 'LW') {
          return { of: o, type: 'mLW' };
        }
        else if (dom.startsWith('L')) {
          return { of: o, type: 'mL', args: [dom.split('-')[1] || 0] };
        }
        else if (dom.endsWith('W')) {
          return { of: o, type: 'mW', args: [parseInt(dom.slice(0,-1))] };
        }
        break;
      case 'w':
        if (dow.includes('#')) {
          return { of: o, type: 'w#', args: dow.split('#').map(x => parseInt(x, 10)) };
        }
        else if (dow.endsWith('L')) {
          return { of: o, type: 'wL', args: [parseInt(dow.slice(0,-1))] };
        }
    }
  }
  parsed = parseField(DAY, o === 'm' ? dom : dow);
  return { of: o, ...parsed, type: o + parsed.type };
};

const stringifyField = (name, field) => {
  const aliases = aliasWords[name];
  switch (field.type) {
    case '*': return '*';
    case '/': return `${field.args[0]}/${field.args[1]}`;
    case '-': return field.args.map(x => aliases ? aliases[x] : x).join('-');
    default: return field.args.map(x => aliases ? aliases[x] : x).join(','); // TODO: try to group consecutive into ranges
  }
};

class Cron {

  /**
  *
  * @param {string} expression
  * @param {string} mode quartz or crontab
  * @returns {Object}
  */
  static parse(expression, mode) {
    if (!expression) {
      return null;
    }

    expression = expression.trim();

    if (expression.startsWith('@')) {
      const predefined = expression.substr(1).toLowerCase();
      if (Object.prototype.hasOwnProperty.call(PREDEFINED, predefined)) {
        expression = PREDEFINED[predefined];
        mode = 'quartz'; // we keep predefined in quartz format
      }
      else {
        throw new Error(`Invalid predefined cron expression ${expression}`);
      }
    }
    else if (mode === 'crontab') {
      expression = '0 ' + expression; // add 'at second 0' since crontab does not contains seconds
    }

    const fields = expression.split(/\s+/);

    if (fields.length < 6 || fields.length > 7) {
      throw new Error('Invalid cron expression');
    }
    if (fields.length === 6) {
      fields.push('*'); // add 'every year'
    }

    return { 
      second: parseField(SECOND, fields[0]),
      minute: parseField(MINUTE, fields[1]),
      hour: parseField(HOUR, fields[2]),
      day: parseDayFields(fields[3], fields[5], mode === 'quartz'),
      month: parseField(MONTH, fields[4]),
      year: parseField(YEAR, fields[6]),
    };
  }

  /**
  *
  * @param {Object} c
  * @returns {string}
  */
  static stringify(c) {
    
    const parts = [];

    parts.push(stringifyField(SECOND, c.second));
    parts.push(stringifyField(MINUTE, c.minute));
    parts.push(stringifyField(HOUR, c.hour));
    parts.push(c.day.of !== 'month' ? '?' : c.day.type); // TODO: DOM
    parts.push(stringifyField(MONTH, c.month));
    parts.push(c.day.of !== 'week' ? '?' : c.day.type); // TODO: DOW
    parts.push(stringifyField(YEAR, c.year));

    return parts.join(' ');
  }

  static config = config;
 }

 export default Cron;