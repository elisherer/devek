class Uint64 {

  constructor(high, low) {
    if (typeof high === 'number' || !high) {
      this.high = (high || 0) & 0xFFFFFFFF;
      this.low = (low || 0) & 0xFFFFFFFF;
    }
    else {
      this.high = high.high;
      this.low = high.low;
    }
  }

  clone() {
    return new Uint64(this);
  }

  set(high, low) {
    this.high = high;
    this.low = low;
    return this;
  }

  and(argument) {
    if (typeof argument === 'number') {
      this.set(0, this.low & argument);
    }
    else {
      this.set(this.high & argument.high, this.low & argument.low);
    }
    return this;
  }

  xor(argument) {
    if (typeof argument === 'number') {
      this.set(this.high ^ 0, this.low ^ argument);
    }
    else {
      this.set(this.high ^ argument.high, this.low ^ argument.low);
    }
    return this;
  }

  shl(dist) {
    for (let i = 0; i < dist; i++) {
      this.high = this.high << 1;
      if ((this.low & 0x80000000) !== 0)
        this.high |= 0x01;
      this.low = this.low << 1;
    }
    return this;
  }

  shr(dist) {
    for (let i = 0; i < dist; i++) {
      this.low = this.low >>> 1;
      if ((this.high & 1) !== 0)
        this.low |= 0x80000000;
      this.high = this.high >>> 1;
    }
    return this;
  }

  reflect() {
    let newHighVal = 0, newLowVal = 0;
    for (let i = 0; i < 32; i++) {
      if ((this.high & (1 << (31 - i))) !== 0)
        newLowVal |= (1 << i);
      if ((this.low & (1 << i)) !== 0)
        newHighVal |= (1 << (31 - i));
    }
    return this.set(newHighVal, newLowVal);
  }

  toString(radix) {
    if (radix === 2)
      return (this.high >>> 0).toString(2) + (this.low >>> 0).toString(2).padStart(32, '0').slice(-32);
    if (!radix || radix === 16)
      return (this.high >>> 0).toString(16) + (this.low >>> 0).toString(16).padStart(8, '0').slice(-8);
    throw new RangeError('radix argument must be 2 or 16');
  }
}

export default Uint64;