import Cron from "./cron";

describe("cron", () => {
	test("parse second every", () => {
		const parsed = Cron.parse("* 0 0 ? * * *");

		expect(parsed.second).toEqual({ type: "*" });
	});
	test("parse second start", () => {
		const parsed = Cron.parse("5/5 0 0 ? * * *");

		expect(parsed.second).toEqual({ type: "/", "/": [5, 5] });
	});
	test("parse second start *", () => {
		const parsed = Cron.parse("*/5 0 0 ? * * *");

		expect(parsed.second).toEqual({ type: "/", "/": [0, 5] });
	});
	test("parse second specific", () => {
		const parsed = Cron.parse("0 0 0 ? * * *");

		expect(parsed.second).toEqual({ type: ",", ",": [0] });
	});
	test("parse second specific multiple", () => {
		const parsed = Cron.parse("0,1-3 0 0 ? * * *");

		expect(parsed.second).toEqual({ type: ",", ",": [0, 1, 2, 3] });
	});

	test("parse month every", () => {
		const parsed = Cron.parse("0 0 0 ? * * *");

		expect(parsed.month).toEqual({ type: "*" });
	});
	test("parse month start", () => {
		const parsed = Cron.parse("0 0 0 ? 5/5 * *");

		expect(parsed.month).toEqual({ type: "/", "/": [5, 5] });
	});
	test("parse month start *", () => {
		const parsed = Cron.parse("0 0 0 ? */5 * *");

		expect(parsed.month).toEqual({ type: "/", "/": [0, 5] });
	});
	test("parse month specific", () => {
		const parsed = Cron.parse("0 0 0 ? 5 * *");

		expect(parsed.month).toEqual({ type: ",", ",": [5] });
	});
	test("parse month specific by name", () => {
		const parsed = Cron.parse("0 0 0 ? MAY * *");

		expect(parsed.month).toEqual({ type: ",", ",": [5] });
	});
});
