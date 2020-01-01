const SECOND = 'second', MINUTE = 'minute', HOUR = 'hour', DAY = 'day', MONTH = 'month', YEAR = 'year';
export const QUARTZ = 'quartz', CRONTAB = 'crontab';
const parseWords = {
  [MONTH]: { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 },
  [CRONTAB + DAY]: { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 },
  [QUARTZ + DAY]: { SUN: 1, MON: 2, TUE: 3, WED: 4, THU: 5, FRI: 6, SAT: 7 },
};
const aliasWords = {
  [MONTH]: [null,"JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"],
  [CRONTAB + DAY]: ["SUN","MON","TUE","WED","THU","FRI","SAT","SUN"],
  [QUARTZ + DAY]: [null, "SUN","MON","TUE","WED","THU","FRI","SAT"],
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

const parseValue = (value, index, name, mode) => {
  if (value[0] < 10) 
    return parseInt(value, 10);
  const word = value.toUpperCase();
  if (parseWords?.[mode + name]?.[word])
    return parseWords[mode + name][word] + (mode === CRONTAB && word === 'SUN' && index === 1 ? 7 : 0);
  if (parseWords?.[name]?.[word]) 
    return parseWords[name][word];
  throw new Error(`Unknown alias ${word} for type ${name}`);
};

const parseField = (name, value, mode) => {
  if (value === '*') {
    return { type: "*" };
  }
  if (/^(\*|\d+)\/\d+$/.test(value)) { // 0/0 , */0
    return { type: "/", "/": value.split('/').map(x => x === '*' ? 0 : parseInt(x, 10)) };
  }
  else if (name !== DAY && /^([A-Z]{3}|\d+)-([A-Z]{3}|\d+)$/i.test(value)) { // range only
    return { type: "-", "-": value.split('-').map((x, i) => parseValue(x, i, name, mode)) };
  }
  return { 
    type: ",",
    ",": value.split(',').reduce((args, arg) => {
      if (arg.includes('-')) {
        const range = arg.split('-').map((x,i) => parseValue(x, i, name, mode));
        for (let i = range[0]; i <= range[1]; i++) args.push(i);
      }
      else {
        args.push(parseValue(arg, -1, name, mode));
      }
      return args;
    }, []),
  };
};

const parseDayFields = (dom, dow, mode) => {
  const quartz = mode === QUARTZ;
  const dayOf = (quartz && dow === '?') || (dow === '*' && dom !== '*' && dom !== '?') ? 'm' : 'w';
  let parsed;
  if (quartz) {
    switch (dayOf) {
      case 'm':
        if (dom === 'LW') {
          return { type: "mLW" };
        }
        else if (dom.startsWith('L')) {
          return { type: "mL", "mL": [dom.split('-')[1] || 0] };
        }
        else if (dom.endsWith('W')) {
          return { type: "mW", "mW": [parseInt(dom.slice(0, -1))] };
        }
        break;
      case 'w':
        if (dow.includes('#')) {
          return { type: "w#", "w#": dow.split('#').map(x => parseInt(x, 10)) };
        }
        else if (dow.endsWith('L')) {
          return { type: "wL", "wL": [parseInt(dow.slice(0, -1))] };
        }
    }
  }
  parsed = parseField(DAY, dayOf === 'm' ? dom : dow);
  return { ...parsed, type: parsed.type === '*' ? '*' : (dayOf + parsed.type) };
};

const stringifyField = (name, field, mode) => {
  const aliases = aliasWords[mode + name] || aliasWords[name];
  const {type} = field;
  switch (type) {
    case '*': return '*';
    case '/': return `${field[type][0]}/${field[type][1]}`;
    case '-': return field[type].map(x => aliases ? aliases[x] : x).join('-');
    default: {
      let firstInRange = null, lastValue = null;
      const output = [];
      for (let x of field[type]) {
        if (lastValue === null || (x - lastValue === 1)) {
          lastValue = x;
          if (firstInRange === null) firstInRange = x;
          continue;
        }
        output.push(firstInRange + (lastValue === firstInRange ? '' : '-' + lastValue));
        lastValue = x;
        firstInRange = x;
      }
      output.push(firstInRange + (lastValue === firstInRange ? '' : '-' + lastValue));
      
      return output.join(',');
    }
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
        mode = QUARTZ; // we keep predefined in quartz format
      }
      else {
        throw new Error(`Invalid predefined cron expression ${expression}`);
      }
    }
    else if (mode === CRONTAB) {
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
      second: parseField(SECOND, fields[0], mode),
      minute: parseField(MINUTE, fields[1], mode),
      hour: parseField(HOUR, fields[2], mode),
      day: parseDayFields(fields[3], fields[5], mode),
      month: parseField(MONTH, fields[4], mode),
      year: parseField(YEAR, fields[6], mode),
    };
  }

  /**
  *
  * @param {Object} c
  * @param {string} mode
  * @returns {string}
  */
  static stringify(c, mode) {
    
    const parts = [];
    const unused = mode === CRONTAB ? '*' : '?';

    if (mode === QUARTZ) parts.push(stringifyField(SECOND, c.second, mode));
    parts.push(stringifyField(MINUTE, c.minute, mode));
    parts.push(stringifyField(HOUR, c.hour, mode));
    parts.push(c.day.type === '*' || c.day.type[0] !== 'm' ? unused : c.day.type); // TODO: DOM
    parts.push(stringifyField(MONTH, c.month, mode));
    parts.push(c.day.type === '*' ? '*' : (c.day.type[0] !== 'w' ? unused : c.day.type)); // TODO: DOW
    parts.push(stringifyField(YEAR, c.year, mode));

    return parts.join(' ');
  }

  static config = config;
 }

 export default Cron;