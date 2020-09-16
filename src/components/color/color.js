const rgbaRegex = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(,\s*(\d*(?:\.\d+)?))?\)$/,
	hslaRegex = /^hsla?\((-?\d+|-?\d+\.\d+)d?e?g?,\s*(\d+|-?\d+\.\d+)%,\s*(\d+|-?\d+\.\d+)%(,\s*(\d*(?:\.\d+)?))?\)$/,
	hwbaRegex = /^hwba?\((-?\d+|-?\d+\.\d+)d?e?g?,\s*(\d+|-?\d+\.\d+)%,\s*(\d+|-?\d+\.\d+)%(,\s*(\d*(?:\.\d+)?))?\)$/,
	cmykaRegex = /^cmyka?\((\d+|-?\d+\.\d+)%,\s*(\d+|-?\d+\.\d+)%,\s*(\d+|-?\d+\.\d+)%,\s*(\d+|-?\d+\.\d+)%(,\s*(\d*(?:\.\d+)?))?\)$/,
	hexRegex = /^#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})$|^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;

const RGBA = (r, g, b, a) => ({ r, g, b, a });

const hue2rgb = (p, q, t) => {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
};

const fromHSL = (h, s, l) => {
	if (s === 0) return { r: l, g: l, b: l };
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return {
		r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
		g: Math.round(hue2rgb(p, q, h) * 255),
		b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
	};
};

export const parsers = {
	rgba: str => {
		const match = str.match(rgbaRegex);
		if (!match) return null;
		let r = Number(match[1]),
			g = Number(match[2]),
			b = Number(match[3]),
			a = Number(match[5]);
		if (r > 255 || g > 255 || b > 255 || a > 1) return null;
		return RGBA(r, g, b, a || 1);
	},
	hex: str => {
		const match = str.match(hexRegex);
		if (!match) return null;
		let r = parseInt(
				match[1].length === 1
					? match[1] + match[1]
					: match[1] || match[4] + match[4],
				16
			),
			g = parseInt(
				match[2].length === 1
					? match[2] + match[2]
					: match[2] || match[5] + match[5],
				16
			),
			b = parseInt(
				match[3].length === 1
					? match[3] + match[3]
					: match[3] || match[6] + match[6],
				16
			);
		return RGBA(r, g, b, 1);
	},
	hsla: str => {
		const match = str.match(hslaRegex);
		if (!match) return null;
		let h = Number(match[1]),
			s = Number(match[2]),
			l = Number(match[3]),
			a = Number(match[5]);
		h = (h % 360) / 360;
		s = s / 100;
		l = l / 100;
		const c = fromHSL(h, s, l);
		return RGBA(c.r, c.g, c.b, a || 1);
	},
	hwba: str => {
		const match = str.match(hwbaRegex);
		if (!match) return null;
		let h = Number(match[1]),
			w = Number(match[2]),
			b = Number(match[3]),
			a = Number(match[5]);
		h = (h % 360) / 360;
		w = w / 100;
		b = b / 100;
		// HWB to HSV
		let sv = 1 - w / (1 - b);
		let v = 1 - b;
		// HSV to HSL
		let l = v - (v * sv) / 2;
		let s = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
		const c = fromHSL(h, s, l);
		return RGBA(c.r, c.g, c.b, a || 1);
	},
	cmyka: str => {
		const match = str.match(cmykaRegex);
		if (!match) return null;
		let c = Number(match[1]),
			m = Number(match[2]),
			y = Number(match[3]),
			k = Number(match[4]),
			a = Number(match[6]);
		c = c / 100;
		m = m / 100;
		y = y / 100;
		k = k / 100;
		return RGBA(
			Math.round(255 * (1 - c) * (1 - k)),
			Math.round(255 * (1 - m) * (1 - k)),
			Math.round(255 * (1 - y) * (1 - k)),
			a || 1
		);
	}
};

const fix = num => parseFloat(num.toFixed(2));

const toHSL = c => {
	const r = c.r / 255,
		g = c.g / 255,
		b = c.b / 255;
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h,
		s,
		l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}
	return { h, s, l };
};

export const formatters = {
	rgba: c =>
		`rgb${c.a < 1 ? "a" : ""}(${c.r}, ${c.g}, ${c.b}${
			c.a < 1 ? ", " + c.a : ""
		})`,
	hex: c =>
		"#" +
		(c.r < 16 ? "0" : "") +
		parseInt(c.r).toString(16) +
		(c.g < 16 ? "0" : "") +
		parseInt(c.g).toString(16) +
		(c.b < 16 ? "0" : "") +
		parseInt(c.b).toString(16),
	hsla: c => {
		const hsl = toHSL(c);
		return `hsl${c.a < 1 ? "a" : ""}(${fix(hsl.h * 360)}, ${fix(
			hsl.s * 100
		)}%, ${fix(hsl.l * 100)}%${c.a < 1 ? ", " + c.a : ""})`;
	},
	hwba: c => {
		const r = c.r / 255,
			g = c.g / 255,
			b = c.b / 255;
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		const h = toHSL(c).h;
		let w = min,
			bl = 1 - max;
		return `hwb${c.a < 1 ? "a" : ""}(${fix(h * 360)}, ${fix(w * 100)}%, ${fix(
			bl * 100
		)}%${c.a < 1 ? ", " + c.a : ""})`;
	},
	cmyka: c => {
		const r = c.r / 255,
			g = c.g / 255,
			b = c.b / 255;
		let k = 1 - Math.max(r, g, b);
		const cy = fix(((1 - r - k) / (1 - k)) * 100),
			m = fix(((1 - g - k) / (1 - k)) * 100),
			y = fix(((1 - b - k) / (1 - k)) * 100);
		k = fix(k * 100);
		return `cmyk${c.a < 1 ? "a" : ""}(${cy}%, ${m}%, ${y}%, ${k}%${
			c.a < 1 ? ", " + c.a : ""
		})`;
	}
};

const allFields = ["rgba", "hex", "hsla", "hwba", "cmyka"];

export const hexLighten = (hex, amount) => {
	const c = parsers.hex(hex);
	const hsl = toHSL(c);
	hsl.l += amount / 100;
	hsl.l = hsl.l > 1 ? 1 : hsl.l < 0 ? 0 : hsl.l; // clamp
	return formatters.hex(fromHSL(hsl.h, hsl.s, hsl.l));
};

export const hexDarken = (hex, amount) => {
	const c = parsers.hex(hex);
	const hsl = toHSL(c);
	hsl.l -= amount / 100;
	hsl.l = hsl.l > 1 ? 1 : hsl.l < 0 ? 0 : hsl.l; // clamp
	return formatters.hex(fromHSL(hsl.h, hsl.s, hsl.l));
};

const linearGradientTo = "linear-gradient(to ";
export const gradients = [
	linearGradientTo + "left",
	linearGradientTo + "right",
	linearGradientTo + "top left",
	linearGradientTo + "top right",
	linearGradientTo + "bottom",
	linearGradientTo + "top",
	linearGradientTo + "bottom left",
	linearGradientTo + "bottom right",
	"radial-gradient(circle at center"
];

export const reduceBy = (field, fields) => {
	const newState = { ...fields, errors: { ...fields.errors } };

	// calc new field (and determine if is valid)
	const parsedValue = parsers[field](fields[field]);
	const invalid = parsedValue === null;

	// if the new value is valid, then calc the others fields new values
	const otherFields = allFields.filter(x => x !== field);
	if (!invalid) {
		newState.parsed = parsedValue;
		otherFields.forEach(otherField => {
			newState[otherField] = formatters[otherField](parsedValue);
			newState.errors[otherField] = false;
		});
	}

	newState.errors[field] = invalid;

	return newState;
};
