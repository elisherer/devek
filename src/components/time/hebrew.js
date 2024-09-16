const HEBREW_MONTHS = [
	"תשרי",
	"חשוון",
	"כסלו",
	"טבת",
	"שבט",
	"אדר א'",
	leap => (leap ? "אדר ב'" : "אדר"),
	"ניסן",
	"אייר",
	"סיוון",
	"תמוז",
	"אב",
	"אלול"
];
const HEBREW_DAYS = [
	"א'",
	"ב'",
	"ג'",
	"ד'",
	"ה'",
	"ו'",
	"ז'",
	"ח'",
	"ט'",
	"י'",
	"י״א",
	"י״ב",
	"י״ג",
	"י״ד",
	"ט״ו",
	"ט״ז",
	"י״ז",
	"י״ח",
	"י״ט",
	"כ'",
	"כ״א",
	"כ״ב",
	"כ״ג",
	"כ״ד",
	"כ״ה",
	"כ״ו",
	"כ״ז",
	"כ״ח",
	"כ״ט",
	"ל"
];
const GEMATRIA = {
	1: "א",
	2: "ב",
	3: "ג",
	4: "ד",
	5: "ה",
	6: "ו",
	7: "ז",
	8: "ח",
	9: "ט",
	10: "י",
	20: "כ",
	30: "ל",
	40: "מ",
	50: "נ",
	60: "ס",
	70: "ע",
	80: "פ",
	90: "צ",
	100: "ק",
	200: "ר",
	300: "ש",
	400: "ת"
};
const LEAP_YEAR_CYCLES = [0, 3, 6, 8, 11, 14, 17];
const MOLAD_INTERVAL = 765433 / 25920;
const AVERAGE_YEAR_LENGTH = (MOLAD_INTERVAL * 235) / 19;
const BEGINNING_OF_1900 = new Date(1900, 0, 1);
const DAYS_UNTIL_1900 = 2067025;

function getMonthsSinceFirstMolad(year) {
	year--;
	let monthsSinceFirstMolad = Math.floor(year / 19) * 235;
	year = year % 19;
	monthsSinceFirstMolad += 12 * year;

	LEAP_YEAR_CYCLES.reduceRight((found, cycle, index) => {
		if (found) return;
		if (year >= cycle) {
			monthsSinceFirstMolad += index;
			return true;
		}
	});
	return monthsSinceFirstMolad;
}

function isLeapYear(nYearH) {
	return LEAP_YEAR_CYCLES.includes(nYearH % 19);
}

function isSameDate(d1, d2) {
	return (
		d1.getFullYear() == d2.getFullYear() &&
		d1.getMonth() == d2.getMonth() &&
		d1.getDate() == d2.getDate()
	);
}

function getAlephBeTishreiDate(year) {
	const monthsSinceFirstMolad = getMonthsSinceFirstMolad(year);
	let chalakim = 793 * monthsSinceFirstMolad + 204;

	let hours = Math.floor(chalakim / 1080);
	chalakim = chalakim % 1080;
	hours += monthsSinceFirstMolad * 12 + 5;

	let days = Math.floor(hours / 24);
	hours = hours % 24;
	days += 29 * monthsSinceFirstMolad + 2;

	let dayOfWeek = days % 7;

	if (
		!isLeapYear(year) &&
		dayOfWeek == 3 &&
		hours * 1080 + chalakim >= 9 * 1080 + 204
	) {
		days += 2;
	} else if (
		isLeapYear(year - 1) &&
		dayOfWeek == 2 &&
		hours * 1080 + chalakim >= 15 * 1080 + 589
	) {
		days += 1;
	} else {
		if (hours >= 18) {
			dayOfWeek = (dayOfWeek + 1) % 7;
			days++;
		}
		if (dayOfWeek == 1 || dayOfWeek == 4 || dayOfWeek == 6) {
			days++;
		}
	}

	const t1 = new Date(+BEGINNING_OF_1900);
	t1.setDate(1 + days - DAYS_UNTIL_1900);
	return t1;
}

function convertToHebrewDate(date) {
	let days = Math.round((date - BEGINNING_OF_1900) / 864e5) + DAYS_UNTIL_1900, // days since 1/1/1900 + days from beginning until 1/1/1900
		d,
		m,
		y = Math.floor(days / AVERAGE_YEAR_LENGTH) + 1;
	const alephBeTishrei = getAlephBeTishreiDate(y);

	if (isSameDate(alephBeTishrei, date)) {
		m = 1;
		d = 1;
	} else {
		if (alephBeTishrei < date) {
			while (getAlephBeTishreiDate(y + 1) <= date) y++;
		} else {
			y--;
			while (getAlephBeTishreiDate(y) > date) y--;
		}

		days = Math.round((date - getAlephBeTishreiDate(y)) / 864e5);

		const lengthOfYear = Math.round(
				(getAlephBeTishreiDate(y + 1) - getAlephBeTishreiDate(y)) / 864e5
			),
			isLeap = isLeapYear(y);

		m = 1;
		let done;
		while (!done) {
			let monthLength;
			if (m === 2) {
				monthLength =
					/* Shalem */ lengthOfYear == 355 || lengthOfYear == 385 ? 30 : 29;
			} else if (m === 3) {
				monthLength =
					/* Haser */ lengthOfYear == 353 || lengthOfYear == 383 ? 29 : 30;
			} else if (m === 4 || m === 7 || m === 9 || m === 11 || m === 13) {
				monthLength = 29;
			} else {
				monthLength = 30;
			}
			if (days >= monthLength) {
				m += isLeap || m != 5 ? 1 : 2;
				days -= monthLength;
			} else done = true;
		}
		d = days + 1;
	}
	return [d, m, y];
}

function hebrewYearInGematria(hebYear) {
	let tmp;
	const thousands = Math.floor(hebYear / 1000);
  let yearStr = GEMATRIA[thousands] ? GEMATRIA[thousands] + "'" : "";
	hebYear -= thousands * 1000;
	while (hebYear) {
		if (hebYear >= 100) {
			tmp = Math.min(4, ~~(hebYear / 100));
			yearStr += GEMATRIA[tmp * 100];
			hebYear -= tmp * 100;
		} else if (hebYear >= 10) {
			tmp = ~~(hebYear / 10);
			yearStr += GEMATRIA[tmp * 10];
			hebYear -= tmp * 10;
		} else {
			yearStr += GEMATRIA[hebYear];
			hebYear -= hebYear;
		}
	}
	return (
		yearStr.substr(0, yearStr.length - 1) + "״" + yearStr[yearStr.length - 1]
	);
}

export default date => {
	const dateClone = date ? new Date(date) : new Date();

	dateClone.setHours(0);
	dateClone.setMinutes(0);
	dateClone.setSeconds(0);
	dateClone.setMilliseconds(0);

	const [d, m, y] = convertToHebrewDate(dateClone);
	const day = HEBREW_DAYS[d - 1];
	const month =
		typeof HEBREW_MONTHS[m - 1] === "function"
			? HEBREW_MONTHS[m - 1](isLeapYear(y))
			: HEBREW_MONTHS[m - 1];
	const year = hebrewYearInGematria(y);
	return day + " ב" + month + ", " + year;
};
