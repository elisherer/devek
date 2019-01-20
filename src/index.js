import { app } from 'hyperapp';
import state from './state';
import actions from './actions';
import view from './components/App';
import { location } from '@hyperapp/router';

let main;

const element = document.createElement('div');
element.id = "root";
document.body.appendChild(element);

if (process.env.NODE_ENV !== 'production') {
  const devtools = require('hyperapp-redux-devtools');
  main = devtools(app)(state,actions,view,element);
} else {
  main = app(state,actions,view,element);
}

const screen_desktop_min = "600px";
let isDesktop;

const handleMobileDesktopSwitch = x => isDesktop = x.matches;
const isDesktopMatcher = window.matchMedia(`(min-width: ${screen_desktop_min})`);
handleMobileDesktopSwitch(isDesktopMatcher);
isDesktopMatcher.addEventListener('change', handleMobileDesktopSwitch);

const handleLocationChange = () => {
  if (!isDesktop) main.app.location();
};

/*const unsubscribe =*/ location.subscribe(main.location);
addEventListener("pushstate", handleLocationChange);
addEventListener("popstate", handleLocationChange);
