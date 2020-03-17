import { hexDarken, hexLighten } from './components/color/color';

const base = {
  // constants
  nativeFont: '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontMono: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',

  screenDesktopMin: '768px',
  navWidth: '240px',
  
  // colors
  primaryColor: '#5500aa',
  secondaryColor: '#7744cc',
 
  highlight: '#1e90ff',
  greyBorder: '#e0e0e0',
  
  foregroundColor: '#303030',
  backgroundColor: '#f3f5f9',
  headerColor: x => x.secondaryColor,
  cardBackground: '#ffffff',
  cardShadow: '3px 3px 11px rgba(0,0,0,.1)',
  tabsTextColor: x => x.secondaryColor,
  scrollbarColor: 'rgba(0,0,0,0.5)',

  codeBackground: '#f0f0f0',

  inputBackground: '#fdfdfd',
  inputDisabledBackground: '#f6f6f6',
  inputPlaceholder: '#bbbbbb',
  inputFocusBorder: x => x.secondaryColor,

  rangeTrackFocusColor: x => hexLighten(x.secondaryColor, 30),

  badgeForeground: x => x.foregroundColor,
  badgeBackground: '#eeeeee',
  badgeHoverBackground: '#dddddd',
 
  togglebarActiveForeground: 'white',
  togglebarForeground: x => x.foregroundColor,
  togglebarBackground: x => x.secondaryColor,
  togglebarActiveHoverBackground: x => hexLighten(x.secondaryColor, x.dark ? -10 : 10),
  togglebarHoverBackground: x => hexLighten(x.secondaryColor, x.dark ? -30 : 30),
  togglebarInactiveBackground: '#cccccc',

  radioBorder: '#c0c0c0',

  buttonBackground: x => x.secondaryColor,
  buttonHoverBackground: x => hexLighten(x.secondaryColor, x.dark ? -10 : 10),
  buttonDisabled: '#dddddd',
  buttonDisabledText: '#444444',

  checkeredLight: 'white',
  checkeredShade: '#eee',
  checkeredBackground: x => `linear-gradient(45deg, ${x.checkeredShade} 25%, transparent 25%, transparent 75%, ${x.checkeredShade} 75%, ${x.checkeredShade} 100%), linear-gradient(45deg, ${x.checkeredShade} 25%, ${x.checkeredLight} 25%, ${x.checkeredLight} 75%, ${x.checkeredShade} 75%, ${x.checkeredShade} 100%)`,

  navBackground: x => `linear-gradient(130deg, ${x.primaryColor}, ${hexDarken(x.primaryColor, 20)})`,
  navForeground: 'rgba(250,250,250,0.7)',
  navSelected: 'white',
  navHoverColor: 'rgba(255,255,255,0.2)',

  searchItemHover: '#e2e2e2',
  searchItemActive: '#f2f2f2',
};

const base_dark = {
  ...base,

  dark: true, // to enable some base logic

  // colors
  highlight: hexDarken('#1e90ff', 20),
  greyBorder: '#444444',

  foregroundColor: '#cccccc',
  backgroundColor: '#1e1e1e',
  cardBackground: '#383838', // must use HEX
  scrollbarColor: 'rgba(192,192,192,0.5)',

  codeBackground: '#2a2a2a',

  inputBackground: '#222222',
  inputDisabledBackground: '#2e2e2e',
  inputPlaceholder: '#777777',

  badgeForeground: 'white',
  badgeBackground: '#666666',
  badgeHoverBackground: '#777777',

  togglebarInactiveBackground: '#444444',
  
  radioBorder: '#606060',

  buttonDisabled: '#777777',

  checkeredLight: '#333',
  checkeredShade: '#444',
};

const evalTheme = theme => 
  Object.keys(theme).reduce((a, key) => {
    a[key] = typeof theme[key] === 'function'? theme[key](theme) : theme[key];
    return a;
  }, {});

export default {
  light: evalTheme(base),
  dark: evalTheme(base_dark),
};