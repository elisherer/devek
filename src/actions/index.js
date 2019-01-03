import { location } from '@hyperapp/router';
import text from './text';

export default {
  location: location.actions,
  ...text
};
