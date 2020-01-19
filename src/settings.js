const defaultSettings = {
  theme: 'light'
};

const settingsFromStorage = localStorage.getItem('settings');

let settings;
try {
  settings = settingsFromStorage ? { ...defaultSettings, ...JSON.parse(settingsFromStorage)} : defaultSettings;
}
catch (e) {
  console.error(e);
  settings = defaultSettings;
}

export default {
  get: key => settings[key],
  set: (key, value) => {
    settings[key] = value;
    localStorage.setItem('settings', JSON.stringify(settings))
  }
};