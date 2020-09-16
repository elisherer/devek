import crc from "./crc";
import db from "./crcDatabase";

const prodArr = [
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	[0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
];
export const luhn = input => {
	let len = input.length,
		mul = 0,
		sum = 0;
	while (len--) {
		sum += prodArr[mul][parseInt(input.charAt(len), 10)];
		mul ^= 1;
	}
	return sum % 10 === 0 && sum > 0;
};

export const crcByName = (width, bytes, name) => {
	if (!bytes || !bytes.length) return 0;
	const model = db[width][name || ""];
	return crc(bytes, width, model[0], model[1], model[2], model[3], model[4]);
};
