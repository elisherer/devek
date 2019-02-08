import { app } from 'hyperapp';
import view from './components/App';
import initialState from './initialState';
import actions from './actions';
import screen from './helpers/screen';
import { location } from '@hyperapp/router';

let main;

const element = document.createElement('div');
element.id = "root";
document.body.appendChild(element);

if (process.env.NODE_ENV !== 'production') {
  const devtools = require('hyperapp-redux-devtools');
  main = devtools(app)(initialState,actions,view,element);
} else {
  main = app(initialState,actions,view,element);
}

const handleLocationChange = () => {
  if (!screen.isDesktop) main.app.locationOnMobile();
  main.app.closeSearch();
};

/*const unsubscribe =*/ location.subscribe(main.location);
addEventListener("pushstate", handleLocationChange);
addEventListener("popstate", handleLocationChange);
main.app.initSearch();

const searchShortcutHandler = e => {
  if (e.key === "s" && e.altKey && !e.shiftKey && !e.ctrlKey) { // Alt + S
    main.app.openSearch();
    setTimeout(() => {
      document.getElementById('search_box').focus();
    }, 0);
    e.preventDefault();
  }
};
addEventListener('keydown', searchShortcutHandler);

