const zeros = '00000000000000000000000000000000'
export default (val, size) => {
  const r = val.length % size;
  if (!r) return val;
  const q = Math.floor(val.length / size);
  return (zeros + val).slice(-size*(q+1));
};