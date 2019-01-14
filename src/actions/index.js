import { location } from '@hyperapp/router';
import text from './text';
import regex from './regex';
import jwt from './jwt';
import xml from './xml';

const app = {
  drawer: () => state => ({
    ...state,
    drawer: !state.drawer
  })
};

export default {
  location: location.actions,
  app,
  ...text,
  ...regex,
  ...jwt,
  ...xml
};
