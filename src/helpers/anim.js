//const ESC = '\u001B[';
//const eraseLine = ESC + '2K';
//const cursorUp = ESC + '1A';

function drawCircle(bitmap, xc, yc, x, y) {
	[
		[x, y],
		[y, x]
	].forEach(o => {
		bitmap[yc + o[0]][xc + o[1]] = true;
		bitmap[yc + o[0]][xc - o[1]] = true;
		bitmap[yc - o[0]][xc + o[1]] = true;
		bitmap[yc - o[0]][xc - o[1]] = true;
	});
}

function circleBres(r) {
	const bitmap = Array.from({ length: r * 2 + 1 }).map(() => Array(r * 2 + 1));
	let xc = r,
		yc = r;
	let x = 0,
		y = r;
	let d = Math.floor((5 - r * 4) / 4);
	drawCircle(bitmap, xc, yc, x, y);
	while (y >= x) {
		x++;
		if (d < 0) {
			d += 2 * x + 1;
		} else {
			y--;
			d += 2 * (x - y) + 1;
		}
		drawCircle(bitmap, xc, yc, x, y);
	}
	return bitmap;
}

function renderDots(bitmap) {
	let text = "";
	for (let y = 0; y < bitmap.length; y += 4) {
		// skip 2 pixels?
		for (let x = 0; x < bitmap[0].length; x += 2) {
			// skip 1 pixel?
			let byte = 0;
			if (bitmap[y] && bitmap[y][x]) byte |= 1 << 0;
			if (bitmap[y + 1] && bitmap[y + 1][x]) byte |= 1 << 1;
			if (bitmap[y + 2] && bitmap[y + 2][x]) byte |= 1 << 2;
			if (bitmap[y] && bitmap[y][x + 1]) byte |= 1 << 3;
			if (bitmap[y + 1] && bitmap[y + 1][x + 1]) byte |= 1 << 4;
			if (bitmap[y + 2] && bitmap[y + 2][x + 1]) byte |= 1 << 5;
			if (bitmap[y + 3] && bitmap[y + 3][x]) byte |= 1 << 6;
			if (bitmap[y + 3] && bitmap[y + 3][x + 1]) byte |= 1 << 7;
			text += String.fromCharCode(byte + 0x2800);
		}
		if (y !== bitmap.length - 1) text += "\n";
	}
	return text;
}
/*
 1 0
 3 2
 */
const blocks = [
	" ",
	"▝",
	"▘",
	"▀",
	"▗",
	"▐",
	"▚",
	"▜",
	"▖",
	"▞",
	"▌",
	"▛",
	"▄",
	"▟",
	"▙",
	"█"
];

/*
  ▄▞▀▀▀▄▖
▗▘       ▚ 
▌ Loading ▐
▌   50%   ▐
▝▖       ▗▘ 
  ▝▀▄▄▄▀▘ 
  
▞▀▀▀▀▀▀▖ 
▌  50% ▌
▚▄▄▄▄▄▄▘   
*/
function renderBlocks(bitmap) {
	let text = "";
	for (let y = 0; y < bitmap.length; y += 2) {
		// skip 2 pixels?
		for (let x = 0; x < bitmap[0].length; x += 2) {
			let byte = 0;
			if (bitmap[y] && bitmap[y][x]) byte |= 1 << 1;
			if (bitmap[y + 1] && bitmap[y + 1][x]) byte |= 1 << 3;
			if (bitmap[y] && bitmap[y][x + 1]) byte |= 1 << 0;
			if (bitmap[y + 1] && bitmap[y + 1][x + 1]) byte |= 1 << 2;
			text += blocks[byte];
		}
		if (y !== bitmap.length - 1) text += "\n";
	}
	return text;
}
const r = 10;
console.log(renderBlocks(circleBres(r)));
console.log(renderDots(circleBres(r)));
