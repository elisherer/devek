import devek from 'devek';
import { luhn, crcByName } from './checksum';
import createStore from "../../helpers/createStore";

const getByFormat = (input, format) => format === 'Hex' ? devek.hexStringToArray(input) : devek.stringToArray(input);

const actionCreators = {
  crcFormat: e => state => ({
    ...state,
    crc: {
      ...state.crc,
      format: e.target.dataset.value,
      result: crcByName(state.crc.width, getByFormat(state.crc.input, e.target.dataset.value), state.crc["name" + state.crc.width])
    }
  }),
  crcWidth: e => state => ({
    ...state,
    crc: {
      ...state.crc,
      width: parseInt(e.target.dataset.value),
      result: crcByName(parseInt(e.target.dataset.value), getByFormat(state.crc.input, state.crc.format), state.crc["name" + parseInt(e.target.dataset.value)])
    }
  }),
  crcName: e => state => ({
    ...state,
    crc: {
      ...state.crc,
      ["name" + state.crc.width]: e.target.dataset.value,
      result: crcByName(state.crc.width, getByFormat(state.crc.input, state.crc.format), e.target.dataset.value)
    }
  }),
  crcInput: e => state => ({
    ...state,
    crc: {
      ...state.crc,
      input: e.target.textContent,
      result: crcByName(state.crc.width, getByFormat(e.target.textContent, state.crc.format), state.crc["name" + state.crc.width])
    }
  }),
  luhnInput: e => state => {
    const input = e.target.value;
    let error = true, valid = false;
    if (/^\d+$/.test(input)) {
       error = false;
       valid = luhn(input);
    }
    return {
      ...state,
      luhn: {
        input,
        valid,
        error
      }
    };
  },
};

const initialState = {
  luhn: {
    input: '',
    valid: false,
    error: false
  },
  crc: {
    input: '',
    format: 'UTF-8',
    width: 32,
    name8: '',
    name16: '',
    name32: '',
    name64: '',
    result: 0
  }
};

export const {
  actions,
  useStore,
} = createStore(actionCreators, initialState, 'checksum');