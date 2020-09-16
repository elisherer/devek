const devek = {};

devek.crypto = window.crypto || window.msCrypto;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

devek.concatUint8Array = (...args) => {
	const o = new Uint8Array(args.reduce((a, c) => a + (c ? c.length : 0), 0));
	if (!o.length) return o;
	let offset = 0;
	args.forEach(c => {
		if (!c || !c.length) return;
		o.set(c, offset);
		offset += c.length;
	});
	return o;
};

const emptyB64 = btoa(""),
	whiteSpaceRegex = /\s+/g;

const toB64Url = b64 =>
	b64.replace(/=+/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const fromB64Url = b64u => b64u.replace(/-/g, "+").replace(/_/g, "/");

devek.stringToBase64 = value =>
	!value
		? emptyB64
		: btoa(String.fromCharCode.apply(null, encoder.encode(value)));
devek.stringToBase64Url = value =>
	!value ? emptyB64 : toB64Url(devek.stringToBase64(value));
devek.stringToArray = s => (!s ? [] : [...s].map(c => c.codePointAt()));
devek.stringToUint8Array = s => encoder.encode(s);

devek.base64ToUint8Array = base64 => {
	base64 = base64.replace(/[\s\t\n]/g, "");
	if (base64.length % 4 !== 0) {
		base64 = base64 + "=".repeat(4 - (base64.length % 4));
	}
	const bytesString = atob(base64);
	const length = bytesString.length;
	const bytes = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		bytes[i] = bytesString.charCodeAt(i);
	}
	return bytes;
};
devek.base64UrlToUint8Array = b64u =>
	devek.base64ToUint8Array(fromB64Url(b64u));

devek.hexStringToArray = s => {
	const bytes = s.replace(whiteSpaceRegex, "").match(/.{2}/g);
	return bytes ? bytes.map(x => parseInt(x, 16)) : [];
};
devek.binaryStringToArray = s => {
	const bytes = s.replace(whiteSpaceRegex, "").match(/.{8}/g);
	return bytes ? bytes.map(x => parseInt(x, 2)) : [];
};

devek.arrayToBase64 = value =>
	!value ? emptyB64 : btoa(String.fromCharCode.apply(null, value));
devek.arrayToBase64Url = value =>
	!value ? emptyB64 : toB64Url(btoa(String.fromCharCode.apply(null, value)));
devek.arrayToHexString = (a, j = "") =>
	(Array.isArray(a) ? a : [...a])
		.map(x => x.toString(16).padStart(2, "0"))
		.join(j);
devek.arrayToAscii = a =>
	decoder.decode(Array.isArray(a) ? new Uint8Array(a).buffer : a);
const charCache = new Array(128);
devek.arrayToUTF8 = array => {
	if (!array) return "";
	const result = [];
	const charFromCodePt = String.fromCodePoint || String.fromCharCode;
	let codePt, byte1;
	const buffLen = array.length;

	for (let i = 0; i < buffLen; ) {
		byte1 = array[i++];
		if (byte1 <= 0x7f) {
			codePt = byte1;
		} else if (byte1 <= 0xdf) {
			codePt = ((byte1 & 0x1f) << 6) | (array[i++] & 0x3f);
		} else if (byte1 <= 0xef) {
			codePt =
				((byte1 & 0x0f) << 12) |
				((array[i++] & 0x3f) << 6) |
				(array[i++] & 0x3f);
		} else if (String.fromCodePoint) {
			// Does not work on IE-11
			codePt =
				((byte1 & 0x07) << 18) |
				((array[i++] & 0x3f) << 12) |
				((array[i++] & 0x3f) << 6) |
				(array[i++] & 0x3f);
		} else {
			codePt = 63; // '?'
			i += 3;
		}
		if (charCache[codePt]) {
			result.push(charCache[codePt]);
		} else {
			try {
				result.push((charCache[codePt] = charFromCodePt(codePt)));
			} catch (e) {
				console.error(e); // eslint-disable-line
				result.push("?");
				charCache[codePt] = "?";
			}
		}
	}
	return result.join("");
};
devek.arrayToUnicode = (array, utf32 = false) => {
	if (!array) return "";
	const result = [];
	let msb, lsb, b2, b3;
	const buffLen = array.length;

	for (let i = 0; i < buffLen; ) {
		msb = array[i++];
		if (utf32) {
			b2 = array[i++];
			b3 = array[i++];
			lsb = array[i++];
			result.push(
				String.fromCodePoint((msb << 24) | (b2 << 16) | (b3 << 8) | lsb)
			);
		} else {
			lsb = array[i++];
			result.push(String.fromCharCode((msb << 8) | lsb));
		}
	}
	return result.join("");
};

devek.arrayToPEM = (array, type) =>
	[
		"-----BEGIN " + type + "-----",
		devek
			.arrayToBase64(array)
			.match(/.{1,64}/g)
			.join("\n"),
		"-----END " + type + "-----\n"
	].join("\n");

devek.numberOfLines = text => {
	if (!text) return 0;
	let length = 1,
		p = -1;
	while ((p = text.indexOf("\n", p + 1)) !== -1) {
		length++;
	}
	return length;
};

window.devek = devek;

export default devek;
