const support = {
  RegExpFlags: (() => {
    const regexpFlagSupported = flag => {
      try { new RegExp(".*", flag) }
      catch (e) { return false }
      return true;
    };
    const result = ['g','m','i'];
    if (regexpFlagSupported('s')) result.push('s');
    if (regexpFlagSupported('u')) result.push('u');
    if (regexpFlagSupported('y')) result.push('y');
    return result;
  })(),
}

export default support;