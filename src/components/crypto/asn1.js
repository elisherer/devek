import devek from "devek";
const fieldNames = require("./fieldNames");
import OID from "./OID";
const certificateTrimmer = /-----\s?[^-]+-----|\r|\n/g;

const pemToUint8Array = buffer =>
	devek.base64ToUint8Array(
		(buffer + "").replace(certificateTrimmer, "").trim()
	);

const parsePEM = buffer => {
	buffer = pemToUint8Array(buffer);
	return { buffer, info: parse(buffer) };
};

const toDate = buffer => {
	const p = devek.arrayToAscii(buffer).match(/.{2}/g);
	return new Date(
		`${p[0] >= 70 ? "19" : "20"}${p[0]}-${p[1]}-${p[2]}T${p[3]}:${p[4]}:${
			p[5]
		}Z`
	);
};

/** Convert key-value tuples to a dictionary */
const toDictionary = children =>
	children.reduce((a, c) => {
		c.value.forEach(val => {
			a[val[0]] = val[1];
		});
		return a;
	}, {});

const tagClasses = ["UNIVERSAL", "APPLICATION", "CONTEXT", "PRIVATE"];

const tagTypes = [
	[
		"reserved",
		"BOOLEAN",
		"INTEGER",
		"BIT STRING",
		"OCTET STRING",
		"NULL",
		"OBJECT IDENTIFIER",
		"ObjectDescriptor",
		"EXTERNAL",
		"REAL",
		"ENUMERATED",
		"EMBEDDED PDV",
		"UTF8String",
		"RELATIVE-OID",
		"14",
		"15",
		"SEQUENCE",
		"SET",
		"NumericString",
		"PrintableString",
		"TeletexString",
		"VideotexString",
		"IA5String",
		"UTCTime",
		"GeneralizedTime",
		"GraphicString",
		"VisibleString",
		"GeneralString",
		"UniversalString",
		"CHARACTER STRING",
		"BMPString"
	]
];

function parse(buffer, offset = 0) {
	const octet1 = buffer[0];
	const octet2 = buffer[1];

	const tagClass = (octet1 & 0b11000000) >> 6;
	const tagClassName = tagClasses[tagClass];
	const tagNumber = octet1 & 0b00011111;
	const tagName = tagTypes[tagClass] ? tagTypes[tagClass][tagNumber] : "N/A";
	const constructed = !!(octet1 & 0b00100000);

	const lengthBytes = octet2 & 0b01111111,
		long = octet2 & 0b10000000,
		indefiniteLength = octet2 === 0x80;

	let headerLength, data;

	if (!long) {
		// is 7 bit
		headerLength = 2;
		data = buffer.slice(headerLength, headerLength + lengthBytes);
	} else if (!indefiniteLength) {
		// is 8 bit to 127 octets
		headerLength = 2 + lengthBytes;
		const dataLength = buffer
			.slice(2, headerLength)
			.reduce((a, c) => a * 0x100 + c, 0);
		data = buffer.slice(headerLength, headerLength + dataLength);
	} else if (constructed) {
		// constructed, indefinite-length
		// FIXME: look for end of content
		headerLength = 2;
		data = buffer.slice(headerLength);
		return {
			offset,
			tagClassName,
			tagClass,
			tagName,
			tagNumber,
			constructed,
			headerLength,
			raw: data,
			value: data
		};
	}

	let children;
	if (constructed) {
		children = parseChildren(data, offset + headerLength);
	}

	const info = {
		offset,
		raw: data,
		value: data,
		headerLength
	};

	if (tagClass === 0) {
		// UNIVERSAL
		switch (tagNumber) {
			case 1: // BOOLEAN
				info.value = !!data[0];
				break;
			case 2: // INTEGER
				if (data[0] === 0 && data.length > 1 && data[1] > 0x7f) {
					data = data.slice(1);
				}
				info.bitSize = data.length * 8;
				if (data.length <= 4) {
					// parse integer (only if 32bit or lower)
					info.value = data.reduce((a, c) => a * 0x100 + c, 0);
				} else {
					info.value = [...data];
				}
				break;
			case 3: // BIT STRING
				info.numberOfUnusedBits = data[0];
				data = data.slice(1);
				info.bitSize = data.length * 8 - info.numberOfUnusedBits;
				info.value = [...data];
				break;
			case 4: // OCTET STRING
				info.value = [...data];
				break;
			//case 5: //NULL
			case 6: //OBJECT IDENTIFIER
				info.value = OID.decode(data);
				info.oid = info.value;
				info.value = fieldNames[info.value] || info.value;
				break;
			//case 7: // ObjectDescriptor
			//case 8: // EXTERNAL
			//case 9: // REAL
			//case 10: // ENUMERATED
			//case 11: // EMBEDDED PDV
			case 12: // UTF8String
				info.value = devek.arrayToUTF8(data);
				break;
			case 16: //SEQUENCE
			case 17: //SET
				info.value = children.map(x => x.value);
				break;
			case 18: // NumericString
			case 19: // PrintableString
			case 20: // TeletexString
			case 21: // VideotexString
			case 22: // IA5String
				info.value = devek.arrayToAscii(data);
				break;
			case 23: // UTCTime
			case 24: // GeneralizedTime
				info.value = toDate(data);
				break;
			//case 25: // GraphicString
			case 26: // VisibleString
				info.value = devek.arrayToAscii(data);
				break;
			//case 27: // GeneralString
			case 28: // UniversalString
				info.value = devek.arrayToUnicode(data, true);
				break;
			case 30: // BMPString
				info.value = devek.arrayToUnicode(data);
				break;
			default:
				info.value = null;
		}
	}

	return {
		...info,
		tagClassName,
		tagClass,
		tagName,
		tagNumber,
		constructed,
		children
	};
}

function parseChildren(buffer, offset) {
	let pos = 0,
		lastPos;
	const parts = [];
	do {
		lastPos = pos;
		const info = parse(buffer.slice(pos), offset + pos);
		pos += info.raw.length + info.headerLength;
		parts.push(info);
	} while (pos < buffer.length && pos > lastPos);
	return parts;
}

// ----- ENCODER -----

const ASN1_TagLength = length => {
	// short form
	if (length < 0x80) {
		return Uint8Array.of(length);
	}
	// long form
	let temp = length;
	let bytesRequired = 0;
	while (temp > 0) {
		temp >>= 8;
		bytesRequired++;
	}
	const result = new Uint8Array(bytesRequired + 1);
	result[0] = bytesRequired | 0x80;
	for (let i = bytesRequired - 1; i >= 0; i--) {
		result[bytesRequired - i] = (length >> (8 * i)) & 0xff;
	}
	return result;
};

const ASN1_Encode = (type, buffer) => {
	return devek.concatUint8Array([type], ASN1_TagLength(buffer.length), buffer);
};

const ASN1_INTEGER_BE = buffer => {
	let leadingZeroes = 0;
	for (let i = 0; i < buffer.length; i++) {
		if (buffer[i] !== 0) break;
		leadingZeroes++;
	}
	if (buffer.length === leadingZeroes)
		// all zeros
		return ASN1_Encode(0x02, [0]);
	if (buffer[leadingZeroes] > 0x7f) {
		return ASN1_Encode(
			0x02,
			devek.concatUint8Array([0], buffer.slice(leadingZeroes))
		);
	} else {
		return ASN1_Encode(0x02, buffer.slice(leadingZeroes));
	}
};

const ASN1_BIT_STRING = (numberOfUnusedBits, buffer) =>
	ASN1_Encode(0x03, devek.concatUint8Array([numberOfUnusedBits], buffer));

const ASN1_OCTET_STRING = buffer => ASN1_Encode(0x04, buffer);

const ASN1_NULL = Uint8Array.of(0x05, 0x00);

const ASN1_OID = oid => ASN1_Encode(0x06, OID.encode(oid));

const ASN1_SEQUENCE = (...values) => {
	return ASN1_Encode(0x30, devek.concatUint8Array(values));
};

const ASN1_UTF8STRING = string => {
	return ASN1_Encode(0x0c, devek.stringToUint8Array(string));
};

const ASN1 = {
	parse,
	parsePEM,
	pemToUint8Array,
	toDate,
	toDictionary,
	BIT_STRING: 0x03,
	OCTET_STRING: 0x04,
	SEQUENCE: 0x10
};

export {
	ASN1,
	ASN1_Encode,
	ASN1_INTEGER_BE,
	ASN1_BIT_STRING,
	ASN1_OCTET_STRING,
	ASN1_NULL,
	ASN1_OID,
	ASN1_SEQUENCE,
	ASN1_UTF8STRING
};
//exports.parseCertificate = parseCertificate;
