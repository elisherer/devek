import actions from 'actions';
import initialState from 'initialState';

actions.time = {
  ampm: e => state => ({
    ...state,
    ampm: e.target.checked,
  }),
};

initialState.time = {
  ampm: false
};
