const 
  primaryColor = '#5500aa',
  primaryDark = '#220044', // darken(primaryColor, 20%),
  secondaryColor = '#1a1897';

const theme = {

  nativeFont: '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, system-ui, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  fontMono: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',

  screenDesktopMin: '768px',

  foregroundColor: '#303030',
  backgroundColor: '#f3f5f9',

  textLightColor: '#575757', // set by accessibility test
  greyBorder: '#cccccc',
  
  primaryColor,
  primaryDark,
  secondaryColor,

  headerHeight: '54px',
  headerBackground: primaryColor,
  headerForeground: 'white',
  
  togglebarBackground: secondaryColor,
  
  radioBackground: '#cccccc',
  
  buttonDisabled: '#dddddd',
  buttonDisabledText: '#444444',
  
  cardBackground: 'white',
  cardLeftBorder: primaryColor,
  cardHeaderBorder: '#eeeeee',
  cardColor: 'white',
  cardShadow: '3px 3px 11px rgba(0,0,0,.1)',
  
  navWidth: '240px',
  navItemHeight: '54px',
  navItemPadding: '10px',
  
  navBackground: `linear-gradient(130deg, ${primaryColor}, ${primaryDark})`,
  navForeground: 'rgba(250,250,250,0.7)',
  navSelected: 'white',
  navHoverColor: 'rgba(255,255,255,0.2)',

  textareaBorder: secondaryColor,
  textareaBackground: '#fdfdfd',
  textareaReadonlyBackground: '#f6f6f6',
};

export default theme;