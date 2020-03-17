const pathRegex = /^[a-z_$][$\w]*((\[(\d+|"[\w$-. ]*")])|(\.[a-z_$][\w$]*(\[(\d+|"[\w-. ]*")])?|$))*$/i;

const queryObject = (obj, path) => {
  let result = obj;
  if (path) {
    const fullPath = 'o' + path;
    if (!pathRegex.test(fullPath)) {
      throw Error("Syntax error");
    }
    const func = new Function("o", "return " + fullPath);
    result = func(obj);
  }
  return JSON.stringify(result, null, 2);
};

export {
  queryObject
};