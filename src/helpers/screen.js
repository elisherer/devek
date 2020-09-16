const screen = {
	isDesktop: null
};

const isSafari = () => {
	const ua = navigator.userAgent.toLowerCase();
	return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
};

const screen_desktop_min = 600,
	screen_desktop_min_px = screen_desktop_min + "px";

if (isSafari()) {
	// doesn't work on Safari
	screen.isDesktop = window.screen.width < screen_desktop_min;
} else {
	const handleMobileDesktopSwitch = x => (screen.isDesktop = x.matches);
	const isDesktopMatcher = window.matchMedia(
		`screen and (min-width: ${screen_desktop_min_px})`
	);
	handleMobileDesktopSwitch(isDesktopMatcher);
	isDesktopMatcher.addEventListener("change", handleMobileDesktopSwitch);
}

export default screen;
