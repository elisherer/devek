import { h } from 'hyperapp';

const now = new Date();
let boundRefreshAction;
let timer;
const startTimer = () => {
  console.log('setting'); // eslint-disable-line
  timer = setInterval(boundRefreshAction, 1000);
};
const clearTimer = () => {
  console.log('clearing'); // eslint-disable-line
  clearTimeout(timer);
};

export default () => (state, actions) => {
  if (!boundRefreshAction) {
    boundRefreshAction = actions.app.refresh; // initialize
  }

  // update before rendering
  now.setTime(Date.now());

  return (
    <div>
      <h2>UTC:</h2>
      {now.toUTCString()}
      <h2>Local:</h2>
      {now.toString()}
      <dt oncreate={startTimer} ondestroy={clearTimer}/>
    </div>
  );
}