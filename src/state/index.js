import { location } from '@hyperapp/router';

export default {
  app: {
    drawer: false
  },
  location: location.state,
  regex: {
    flags: 'gm'
  },
  jwt: {
    token: [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      'eyJzdWIiOiIxMjM0NTYiLCJuYW1lIjoiSm9obiBEb2UiLCJzZWNyZXQtaXMiOiJaV3hwIn0',
      'e9H37jdA03uJoMwTPdMgTz6ITi68dUNkHMT3H1hlbS4'
    ].join('.'),
  },
  json: {
    input: '{"x":1}'
  },
};