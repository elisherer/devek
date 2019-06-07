const berToJavaScript = byteArray => {
  const result = {};
  let position = 0;

  result.cls              = (byteArray[position] & 0xc0) / 64;
  result.structured       = ((byteArray[0] & 0x20) === 0x20);

  // Get tag
  let tag = byteArray[0] & 0x1f;
  position += 1;
  if (tag === 0x1f) {
    tag = 0;
    while (byteArray[position] >= 0x80) {
      tag = tag * 128 + byteArray[position] - 0x80;
      position += 1;
    }
    tag = tag * 128 + byteArray[position] - 0x80;
    position += 1;
  }
  result.tag = tag;

  // Get length
  let length = 0;

  if (byteArray[position] < 0x80) {
    length = byteArray[position];
    position += 1;
  } else {
    const numberOfDigits = byteArray[position] & 0x7f;
    position += 1;
    length = 0;
    for (let i=0; i<numberOfDigits; i++) {
      length = length * 256 + byteArray[position];
      position += 1;
    }
  }

  if (length === 0x80) {
    length = 0;
    while (byteArray[position + length] !== 0 || byteArray[position + length + 1] !== 0) {
      length += 1;
    }
    result.byteLength   = position + length + 2;
    result.contents     = byteArray.subarray(position, position + length);
  } else {
    result.byteLength   = position + length;
    result.contents     = byteArray.subarray(position, result.byteLength);
  }

  result.raw              = byteArray.subarray(0, result.byteLength); // May not be the whole input array
  return result;
};

const berListToJavaScript = byteArray => {
  const result = [];
  let nextPosition = 0;
  while (nextPosition < byteArray.length) {
    const nextPiece = berToJavaScript(byteArray.subarray(nextPosition));
    result.push(nextPiece);
    nextPosition += nextPiece.byteLength;
  }
  return result;
};

function berBitStringValue(byteArray) {
  return {
    unusedBits: byteArray[0],
    bytes: byteArray.subarray(1)
  };
}

function berObjectIdentifierValue(byteArray) {
  var oid = Math.floor(byteArray[0] / 40) + "." + byteArray[0] % 40;
  var position = 1;
  while(position < byteArray.length) {
    var nextInteger = 0;
    while (byteArray[position] >= 0x80) {
      nextInteger = nextInteger * 0x80 + (byteArray[position] & 0x7f);
      position += 1;
    }
    nextInteger = nextInteger * 0x80 + byteArray[position];
    position += 1;
    oid += "." + nextInteger;
  }
  return oid;
}

function parseSignatureValue(asn1) {
  if (asn1.cls !== 0 || asn1.tag !== 3 || asn1.structured) {
    throw new Error("Bad signature value. Not a BIT STRING.");
  }
  return {
    asn1: asn1,
    bits: berBitStringValue(asn1.contents)
  };
}

var parseSignatureAlgorithm = parseAlgorithmIdentifier;
function parseAlgorithmIdentifier(asn1) {
  if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
    throw new Error("Bad algorithm identifier. Not a SEQUENCE.");
  }
  var alg = {asn1: asn1};
  var pieces = berListToJavaScript(asn1.contents);
  if (pieces.length > 2) {
    throw new Error("Bad algorithm identifier. Contains too many child objects.");
  }
  var encodedAlgorithm = pieces[0];
  if (encodedAlgorithm.cls !== 0 || encodedAlgorithm.tag !== 6 || encodedAlgorithm.structured) {
    throw new Error("Bad algorithm identifier. Does not begin with an OBJECT IDENTIFIER.");
  }
  alg.algorithm = berObjectIdentifierValue(encodedAlgorithm.contents);
  if (pieces.length === 2) {
    alg.parameters = {asn1: pieces[1]}; // Don't need this now, so not parsing it
  } else {
    alg.parameters = null;  // It is optional
  }
  return alg;
}

function parseSubjectPublicKeyInfo(asn1) {
  if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
    throw new Error("Bad SPKI. Not a SEQUENCE.");
  }
  var spki = {asn1: asn1};
  var pieces = berListToJavaScript(asn1.contents);
  if (pieces.length !== 2) {
    throw new Error("Bad SubjectPublicKeyInfo. Wrong number of child objects.");
  }
  spki.algorithm = parseAlgorithmIdentifier(pieces[0]);
  spki.bits = berBitStringValue(pieces[1].contents);
  return spki;
}

function parseTBSCertificate(asn1) {
  if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
    throw new Error("This can't be a TBSCertificate. Wrong data type.");
  }
  var tbs = {asn1: asn1};  // Include the raw parser result for debugging
  var pieces = berListToJavaScript(asn1.contents);
  if (pieces.length < 7) {
    throw new Error("Bad TBS Certificate. There are fewer than the seven required children. " + pieces);
  }
  tbs.version = pieces[0];
  tbs.serialNumber = pieces[1];
  tbs.signature = parseAlgorithmIdentifier(pieces[2]);
  tbs.issuer = pieces[3];
  tbs.validity = pieces[4];
  tbs.subject = pieces[5];
  tbs.subjectPublicKeyInfo = parseSubjectPublicKeyInfo(pieces[6]);
  return tbs;  // Ignore optional fields for now
}

const parseCertificate = byteArray => {
  const asn1 = berToJavaScript(byteArray);
  if (asn1.cls !== 0 || asn1.tag !== 16 || !asn1.structured) {
    throw new Error("This can't be an X.509 certificate. Wrong data type.");
  }

  const cert = {asn1: asn1};  // Include the raw parser result for debugging
  const pieces = berListToJavaScript(asn1.contents);
  /*if (pieces.length !== 3) {
    throw new Error("Certificate contains more than the three specified children.");
  }*/

  cert.tbsCertificate     = parseTBSCertificate(pieces[0]);
  cert.signatureAlgorithm = parseSignatureAlgorithm(pieces[1]);
  cert.signatureValue     = parseSignatureValue(pieces[2]);

  return cert;
};

const certificate = `
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
P0VbDxUMTGrdMmK2BJuq`;

const c2 = `MIIC2jCCAkMCAg38MA0GCSqGSIb3DQEBBQUAMIGbMQswCQYDVQQGEwJKUDEOMAwG
A1UECBMFVG9reW8xEDAOBgNVBAcTB0NodW8ta3UxETAPBgNVBAoTCEZyYW5rNERE
MRgwFgYDVQQLEw9XZWJDZXJ0IFN1cHBvcnQxGDAWBgNVBAMTD0ZyYW5rNEREIFdl
YiBDQTEjMCEGCSqGSIb3DQEJARYUc3VwcG9ydEBmcmFuazRkZC5jb20wHhcNMTIw
ODIyMDUyNzQxWhcNMTcwODIxMDUyNzQxWjBKMQswCQYDVQQGEwJKUDEOMAwGA1UE
CAwFVG9reW8xETAPBgNVBAoMCEZyYW5rNEREMRgwFgYDVQQDDA93d3cuZXhhbXBs
ZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC0z9FeMynsC8+u
dvX+LciZxnh5uRj4C9S6tNeeAlIGCfQYk0zUcNFCoCkTknNQd/YEiawDLNbxBqut
bMDZ1aarys1a0lYmUeVLCIqvzBkPJTSQsCopQQ9V8WuT252zzNzs68dVGNdCJd5J
NRQykpwexmnjPPv0mvj7i8XgG379TyW6P+WWV5okeUkXJ9eJS2ouDYdR2SM9BoVW
+FgxDu6BmXhozW5EfsnajFp7HL8kQClI0QOc79yuKl3492rH6bzFsFn2lfwWy9ic
7cP8EpCTeFp1tFaD+vxBhPZkeTQ1HKx6hQ5zeHIB5ySJJZ7af2W8r4eTGYzbdRW2
4DDHCPhZAgMBAAEwDQYJKoZIhvcNAQEFBQADgYEAQMv+BFvGdMVzkQaQ3/+2noVz
/uAKbzpEL8xTcxYyP3lkOeh4FoxiSWqy5pGFALdPONoDuYFpLhjJSZaEwuvjI/Tr
rGhLV1pRG9frwDFshqD2Vaj4ENBCBh6UpeBop5+285zQ4SI7q4U9oSebUDJiuOx6
+tZ9KynmrbJpTSi0+BM=`;

const certificateBytes = new Uint8Array(Buffer.from(c2.replace(/\n/g,''), 'base64').toString().split('').map(c => c.charCodeAt()));

const ob = parseCertificate(certificateBytes);
console.dir(ob);