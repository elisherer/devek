export const loadFileAsync = (file, callback) => {
  if (typeof FileReader === "undefined" || !file) return; // no file
  const reader = new FileReader();
  reader.onload = e => {
    callback(e.target.result);
  };
  reader.onerror = () => {
    reader.abort();
  };
  reader.readAsText(file);
};

const printHex = (array, width, indent) => {
  let output = '';
  for (let i=0 ; i < array.length ; i++) {
    if (i && i % width === 0) output += ' '.repeat(indent);
    let byte = array[i].toString(16);
    if (byte.length < 2) byte = '0' + byte;
    output += byte + ':';
  }
  return output;
};

export const prettyCert = (cert) => {

  let output = `
Certificate:
    Data:
        Version: ${cert.version + 1} (0x${cert.version})
        Serial Number:
            ${printHex(cert.serialNumber)}
    Signature Algorithm: ${cert.signature.algorithm}
        Issuer: ${Object.keys(cert.issuer).map(d => d + '=' + cert.issuer[d]).join(', ')}
        Validity
            Not Before: ${cert.validity.notBefore}
            Not After : ${cert.validity.notAfter}
        Subject: ${Object.keys(cert.subject).map(d => d + '=' + cert.subject[d]).join(', ')}
        Subject Public Key Info:
            Public Key Algorithm: ${cert.subjectPublicKeyInfo.algorithm}
                Public-Key: (4096 bit)
                Modulus:`;
  return output;
};