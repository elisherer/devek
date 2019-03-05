const is_number = /^\d+$/;
const iso_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

const parsers = {
  iso: str => iso_8601.test(str) ? new Date(str) : NaN,
  epoch: str => is_number.test(str) ? new Date(parseFloat(str)) : NaN,
};
const formatters = {
  iso: (date, tz) => {
    if (tz === 0) return date.toISOString();
    const cl = new Date(date.getTime() + tz * 3600000);
    return cl.toISOString().slice(0,-1) + (tz > 0 ? '+' : '-') + (Math.abs(tz) > 9 ? '' : '0' ) + Math.abs(tz) + ':00';
  },
  epoch: date => date.getTime(),
};
export const reduceBy = (field, fields) => {
  const newState = { ...fields, errors: { ...fields.errors }};

  // calc new field (and determine if is valid)
  const parsedValue = parsers[field](fields[field]);
  const invalid = isNaN(parsedValue);

  // if the new value is valid, then calc the others fields new values
  const otherField = field === "iso" ? "epoch" : "iso";
  if (!invalid) {
    newState.parsed = parsedValue;
    newState[otherField] = formatters[otherField](parsedValue, fields.timezone);
    newState.errors[otherField] = false;
  }

  newState.errors[field] = invalid;

  return newState;
};

export const getWeek = date => {
  date = new Date(date.getTime()); // clone
  date.setHours(0, 0, 0, 0); // clear time
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7); // Thursday in current week decides the year.
  const week1 = new Date(date.getFullYear(), 0, 4);  // January 4 is always in week 1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    - 3 + (week1.getDay() + 6) % 7) / 7);
};