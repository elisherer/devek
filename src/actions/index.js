import { location } from '@hyperapp/router';
import text from './text';
import regex from './regex';
import jwt from './jwt';
import json from './json';
import xml from './xml';
import random from './random';

const app = {
  drawer: () => state => ({
    ...state,
    drawer: !state.drawer
  }),
  location: () => state => state.drawer ? ({
    ...state,
    drawer: false
  }) : state,
  search: e => state => ({
    ...state,
    search: e.target.value
  }),
  refresh: () => state => ({
    ...state,
    refresh: !state.refresh
  }),
};

export default {
  location: location.actions,
  app,
  ...text,
  ...regex,
  ...jwt,
  ...xml,
  ...json,
  ...random
};
