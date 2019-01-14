export const getInput = state => state.xml && typeof state.xml.input === 'string' ?state.xml.input : '';
export const getXPath = state => state.xml && typeof state.xml.xpath === 'string' ?state.xml.xpath : '';

const actions = {
  xml: {
    set: e => state => ({
      ...state,
      input: e.target.innerText
    }),
    xpath: e => state => ({
      ...state,
      xpath: e.target.value
    }),
  }
};

export default actions;