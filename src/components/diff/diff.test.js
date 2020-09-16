import { diffText } from "./diff";

const tests = {
	"all-changes": {
		a: "a,b,c,d,e,f,g,h,i,j,k,l".replace(/,/g, "\n"),
		b: "0,1,2,3,4,5,6,7,8,9".replace(/,/g, "\n"),
		expected: "12.10.0.0"
	},
	"all-same": {
		a: "a,b,c,d,e,f,g,h,i,j,k,l".replace(/,/g, "\n"),
		b: "a,b,c,d,e,f,g,h,i,j,k,l".replace(/,/g, "\n"),
		expected: ""
	},
	snake: {
		a: "a,b,c,d,e,f".replace(/,/g, "\n"),
		b: "b,c,d,e,f,x".replace(/,/g, "\n"),
		expected: "1.0.0.0*0.1.6.5"
	},
	"2002.09.20 - repro": {
		a: "c1,a,c2,b,c,d,e,g,h,i,j,c3,k,l".replace(/,/g, "\n"),
		b: "C1,a,C2,b,c,d,e,I1,e,g,h,i,j,C3,k,I2,l".replace(/,/g, "\n"),
		expected: "1.1.0.0*1.1.2.2*0.2.7.7*1.1.11.13*0.1.13.15"
	},
	"2003.02.07 - repro": {
		a: "F".replace(/,/g, "\n"),
		b: "0,F,1,2,3,4,5,6,7".replace(/,/g, "\n"),
		expected: "0.1.0.0*0.7.1.2"
	},
	"2003.04.09 - Muegel - repro": {
		a: "HELLO\nWORLD",
		b: "\n\nhello\n\n\n\nworld\n",
		expected: "2.8.0.0"
	},
	"some-changes": {
		a: "a,b,-,c,d,e,f,f".replace(/,/g, "\n"),
		b: "a,b,x,c,e,f".replace(/,/g, "\n"),
		expected: "1.1.2.2*1.0.4.4*1.0.7.6"
	},
	"one change within long chain of repeats": {
		a: "a,a,a,a,a,a,a,a,a,a".replace(/,/g, "\n"),
		b: "a,a,a,a,-,a,a,a,a,a".replace(/,/g, "\n"),
		expected: "0.1.4.4*1.0.9.10"
	}
};

describe("diff", () => {
	Object.keys(tests).forEach(test => {
		it(test, () => {
			const diff = diffText(
				tests[test].a,
				tests[test].b,
				false,
				false,
				false,
				"\n"
			).diff;
			let actual = diff
				.map(
					d => d.deletedA + "." + d.insertedB + "." + d.startA + "." + d.startB
				)
				.join("*");
			expect(actual).toEqual(tests[test].expected);
		});
	});
});
