import { location } from '@hyperapp/router';
import text from './text';
import regex from './regex';
import jwt from './jwt';
import json from './json';
import xml from './xml';

const app = {
  drawer: () => state => ({
    ...state,
    drawer: !state.drawer
  }),
  close: () => state => ({
    ...state,
    drawer: false
  }),
  search: e => state => ({
    ...state,
    search: e.target.value
  })
};

export default {
  location: location.actions,
  app,
  ...text,
  ...regex,
  ...jwt,
  ...xml,
  ...json,
};
