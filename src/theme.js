import { hexDarken, hexLighten } from './components/color/color';

const base = {
  // constants
  nativeFont: '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, system-ui, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontMono: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',

  screenDesktopMin: '768px',
  navWidth: '240px',
  
  // colors
  primaryColor: '#5500aa',
  secondaryColor: '#2060e0',
 
  highlight: '#1e90ff',
  greyBorder: '#cccccc',
  strongGreyBorder: x => hexDarken(x.greyBorder, x.dark ? -20 : 20),
  
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

  badgeForeground: x => x.foregroundColor,
  badgeBackground: '#eeeeee',
  badgeHoverBackground: '#dddddd',
 
  togglebarBackground: x => x.secondaryColor,
  togglebarActiveHoverBackground: x => hexLighten(x.secondaryColor, x.dark ? -10 : 10),
  togglebarHoverBackground: x => hexLighten(x.secondaryColor, x.dark ? -30 : 30),
  togglebarInactiveBackground: '#cccccc',

  radioMark: x => hexLighten(x.secondaryColor, 30),

  buttonBackground: x => x.secondaryColor,
  buttonHoverBackground: x => hexLighten(x.secondaryColor, x.dark ? -10 : 10),
  buttonDisabled: '#dddddd',
  buttonDisabledText: '#444444',
    
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
  cardBackground: '#383838',
  scrollbarColor: 'rgba(192,192,192,0.5)',

  codeBackground: '#2a2a2a',

  inputBackground: '#222222',
  inputDisabledBackground: '#2e2e2e',
  inputPlaceholder: '#777777',

  badgeForeground: 'white',
  badgeBackground: '#666666',
  badgeHoverBackground: '#777777',

  togglebarInactiveBackground: '#444444',

};

const evalTheme = theme => 
  Object.keys(theme).reduce((a, key) => {
    a[key] = typeof theme[key] === 'function'? theme[key](theme) : theme[key];
    return a;
  }, {});

const light = evalTheme(base),
  dark = evalTheme(base_dark);
const theme = evalTheme(dark);


export default theme;