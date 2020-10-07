const vlq = v => {
	let m = 0x00;
	let output = [];
	while (v >= 0x80) {
		output.unshift((v & 0x7f) | m);
		v = v >> 7;
		m = 0x80;
	}
	output.unshift(v | m);
	return output;
};

const OID = {
	decode: buffer => {
		let result = ~~(buffer[0] / 40) + "." + (buffer[0] % 40);
		for (let i = 1, val = 0; i < buffer.length; i++) {
			val = val * 0x80 + (buffer[i] & 0x7f);
			if ((buffer[i] & 0x80) === 0) {
				result += "." + val;
				val = 0;
			}
		}
		return result;
	},
	encode: oid => {
		const parts = oid.split(".").map(x => parseInt(x, 10));
		let result = [parts[0] * 40 + parts[1]];
		for (let i = 2; i < parts.length; i++) {
			if (parts[i] < 0x80) result.push(parts[i]);
			else {
				result = result.concat(vlq(parts[i]));
			}
		}
		return new Uint8Array(result);
	}
};

export default OID;
