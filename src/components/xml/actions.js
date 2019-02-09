import actions from 'actions';
import initialState from 'initialState';

actions.xml = {
  xml: e => state => ({
    ...state,
    xml: e.target.innerText
  }),
  xpathToggle: e => state => ({
    ...state,
    xpathEnabled: !state.xpathEnabled,
  }),
  xpath: e => state => ({
    ...state,
    xpath: e.target.value,
  }),
};

initialState.xml = {
  xpath: '/*'
};

export const getXML = state => state.xml && typeof state.xml.xml === 'string' ?state.xml.xml : '';
export const getXPath = state => state.xml && typeof state.xml.xpath === 'string' ?state.xml.xpath : '';
export const getXPathEnabled = state => state.xml && state.xml.xpathEnabled;