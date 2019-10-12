import Uint64 from 'helpers/Uint64';

const reflect = (val, width) => {
  let resByte = 0;

  for (let i = 0; i < width; i++) {
    if ((val & (1 << i)) !== 0) {
      resByte |= (1 << ((width-1) - i));
    }
  }
  return resByte;
};

const getCurrByte = (dividend, width, castMask, msbMask, polynomial) => {
  let currByte = (dividend << (width - 8)) & castMask;
  for (let bit = 0; bit < 8; bit++) {
    if ((currByte & msbMask) !== 0) {
      currByte <<= 1;
      currByte ^= polynomial;
    }
    else {
      currByte <<= 1;
    }
  }
  return currByte;
};

const modelCache = {};
const getModelCacheKey = (width, polynomial, initialVal, xorOut, inputReflected, outputReflected) =>
  `${width}_${polynomial}_${initialVal}_${xorOut}_${inputReflected ? "in" : "no"}_${outputReflected ? "out" : "no"}`;

const compute = (bytes, width, polynomial, initialVal, xorOut, inputReflected, outputReflected) => {
  const key = getModelCacheKey(width, polynomial, initialVal, xorOut, inputReflected, outputReflected);
  if (!Object.prototype.hasOwnProperty.call(modelCache, key)) {
    const model = { polynomial, initialVal, xorOut, inputReflected, outputReflected };
    let castMask, crcTable;
    const msbMask = width === 64 ? 0x80000000 : 1 << (width - 1);
    switch (width)
    {
      case 8: crcTable = new Uint8Array(256); castMask = 0xFF; break;
      case 16: crcTable = new Uint16Array(256); castMask = 0xFFFF; break;
      case 32: crcTable = new Uint32Array(256); castMask = 0xFFFFFFFF; break;
      case 64: crcTable = new Array(256); castMask = new Uint64(0xFFFFFFFF, 0xFFFFFFFF); break;
      default: throw "Invalid CRC width";
    }
    if (width === 64) {
      for (let dividend = 0; dividend < 256; dividend++) {
        const currByte = new Uint64(0, dividend);
        currByte.shl(56).and(castMask);
        for (let bit = 0; bit < 8; bit++) {
          if ((currByte.high & msbMask) !== 0) {
            currByte.shl(1);
            currByte.xor(polynomial);
          }
          else currByte.shl(1);
        }
        crcTable[dividend] = currByte.and(castMask);
      }
    }
    else {
      for (let dividend = 0; dividend < 256; dividend++) {
        const currByte = getCurrByte(dividend, width, castMask, msbMask, polynomial);
        crcTable[dividend] = (currByte & castMask);
      }
    }
    modelCache[key] = model;
    model.compute = bytes => {
      if (width === 64) {
        const crc = new Uint64(initialVal);
        for (let i = 0; i < bytes.length; i++) {
          let curByte = bytes[i] & 0xFF;

          if (inputReflected) {
            curByte = reflect(curByte, 8);
          }

          // update the MSB of crc value with next input byte
          const curByteShifted56 = new Uint64(0, curByte).shl(56);
          crc.xor(curByteShifted56).and(castMask);

          // this MSB byte value is the index into the lookup table
          const pos = crc.clone().shr(56).low & 0xFF;
          // shift out this index
          crc.shl(8).and(castMask);
          // XOR-in remainder from lookup table using the calculated index
          crc.xor(crcTable[pos]).and(castMask);
        }

        if (outputReflected) {
          crc.reflect();
        }
        return crc.xor(xorOut).and(castMask);
      }

      let crc = initialVal;
      for (let i = 0; i < bytes.length; i++) {
        let curByte = bytes[i] & 0xFF;

        if (inputReflected) {
          curByte = reflect(curByte, 8);
        }

        // update the MSB of crc value with next input byte
        crc = (crc ^ (curByte << (width - 8))) & castMask;
        // this MSB byte value is the index into the lookup table
        const pos = (crc >> (width - 8)) & 0xFF;
        // shift out this index
        crc = (crc << 8) & castMask;
        // XOR-in remainder from lookup table using the calculated index
        crc = (crc ^ crcTable[pos]) & castMask;
      }

      if (outputReflected) {
        crc = reflect(crc, width);
      }
      return ((crc ^ xorOut) & castMask) >>> 0; // convert to unsigned
    };
  }
  return modelCache[key].compute(bytes);
};

export default compute;