const printHex = (array, width = -1, indent = 0) => {
	if (!Array.isArray(array)) return `${array} (0x${array.toString(16)})`;
	let output = array
		.map(x => {
			const byte = x.toString(16);
			return byte.length === 2 ? byte : "0" + byte;
		})
		.join(":");
	if (width === -1 || output.length < width * 3) return output;
	return output
		.match(new RegExp(`.{1,${width * 3}}`, "g"))
		.join("\n" + " ".repeat(indent));
};

const openSslAliases = {
	countryName: "C",
	stateOrProvinceName: "ST",
	localityName: "L",
	organizationName: "O",
	organizationalUnitName: "OU",
	commonName: "CN",
	pkcs9_emailAddress: "emailAddress"
};

function replacer(key, value) {
	if (Array.isArray(value) && typeof value[0] === "number") {
		return printHex(value);
	}
	return value;
}

export const prettyCert = cert => {
	const publicKey =
		cert.subjectPublicKeyInfo.algorithm === "rsaEncryption"
			? `
                Public-Key: ${cert.subjectPublicKeyInfo.publicKey.publicKey}
                Modulus:
                    ${printHex(
											cert.subjectPublicKeyInfo.publicKey.modulus,
											15,
											20
										)}
                Exponent: ${printHex(
									cert.subjectPublicKeyInfo.publicKey.exponent
								)}`
			: `
                Public-Key: ${cert.subjectPublicKeyInfo.publicKey.publicKey}
                pub:
                    ${printHex(cert.subjectPublicKeyInfo.publicKey.pub, 15, 20)}
                ASN1 OID: ${cert.subjectPublicKeyInfo.publicKey.asn1Oid}
                NIST CURVE: ${cert.subjectPublicKeyInfo.publicKey.nistCurve}`;

	let extensions = "";
	if (cert.extensions) {
		extensions = `
        X509v3 extensions:\n`;
		Object.keys(cert.extensions).forEach(ext => {
			extensions += `            ${ext}: ${
				cert.extensions[ext].critical ? "critical" : ""
			}
                ${JSON.stringify(
									cert.extensions[ext].value,
									replacer,
									2
								).replace(/\n/g, "\n                ")}\n`;
		});
	}

	return `Certificate:
    Data:
        Version: ${cert.version + 1} (0x${cert.version})
        Serial Number:
            ${printHex(cert.serialNumber)}
    Signature Algorithm: ${cert.signature.algorithm}
        Issuer: ${Object.keys(cert.issuer)
					.map(d => (openSslAliases[d] || d) + "=" + cert.issuer[d])
					.join(", ")}
        Validity
            Not Before: ${cert.validity.notBefore.toGMTString()}
            Not After : ${cert.validity.notAfter.toGMTString()}
        Subject: ${Object.keys(cert.subject)
					.map(d => (openSslAliases[d] || d) + "=" + cert.subject[d])
					.join(", ")}
        Subject Public Key Info:
            Public Key Algorithm: ${
							cert.subjectPublicKeyInfo.algorithm
						}${publicKey}${extensions}
    Signature Algorithm: ${cert.signatureAlgorithm.algorithm}
         ${printHex(cert.signatureValue, 18, 9)}`;
};
