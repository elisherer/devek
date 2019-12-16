export default search => search.substring(search.indexOf('?')+1).split('&').reduce((a,c) => {
  const indexOfEq = c.indexOf('=');
  const key = decodeURIComponent(indexOfEq > -1 ? c.substring(0, indexOfEq) : c);
  const value = indexOfEq > -1 ? decodeURIComponent(c.substring(indexOfEq + 1)) : true;
  if (!Object.prototype.hasOwnProperty.call(a, key)) { // not yet added
    a[key] = value;
  }
  else if (!Array.isArray(a[key])) { // already added once
    a[key] = [a[key], value];
  }
  else { // already added more than once
    a[key].push(value);
  }
  return a;
}, {});