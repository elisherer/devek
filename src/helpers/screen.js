const screen = {
  isDesktop: null
};

const screen_desktop_min = "600px";

const handleMobileDesktopSwitch = x => screen.isDesktop = x.matches;
const isDesktopMatcher = window.matchMedia(`screen and (min-width: ${screen_desktop_min})`);
handleMobileDesktopSwitch(isDesktopMatcher);
isDesktopMatcher.addEventListener('change', handleMobileDesktopSwitch);

export default screen;