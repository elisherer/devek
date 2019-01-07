import { location } from '@hyperapp/router';
import text from './text';
import regex from './regex';
import jwt from './jwt';

export default {
  location: location.actions,
  ...text,
  ...regex,
  ...jwt,
};
