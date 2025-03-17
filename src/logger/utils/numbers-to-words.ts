const units = [
	"",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
];
const teens = [
	"",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
];
const tens = [
	"",
	"ten",
	"twenty",
	"thirty",
	"forty",
	"fifty",
	"sixty",
	"seventy",
	"eighty",
	"ninety",
];
const scales = [
	"",
	"thousand",
	"million",
	"billion",
	"trillion",
	"quadrillion",
	"quintillion",
	"sextillion",
	"septillion",
	"octillion",
	"nonillion",
	"decillion",
	"undecillion",
	"duodecillion",
	"tredecillion",
	"quattuordecillion",
	"quindecillion",
	"sexdecillion",
	"septendecillion",
	"octodecillion",
	"novemdecillion",
	"vigintillion",
];

export default class NumbersInWords {
	static numberToWords(_number: number) {
		let number = _number;
		if (number === 0) {
			return "zero";
		}

		let words = "";

		for (let i = 0; number > 0; i++) {
			if (number % 1000 !== 0) {
				words = `${this.convertHundreds(number % 1000)} ${scales[i]} ${words}`;
			}
			number = Math.floor(number / 1000);
		}

		return words.trim();
	}

	static convertHundreds(_number: number) {
		let number = _number;
		let word = "";

		if (number >= 100) {
			word = `${word}${units[Math.floor(number / 100)]} hundred `;
			number %= 100;
		}

		if (number >= 11 && number <= 19) {
			return `${word}${teens[number % 10]} `;
		}

		if (number === 10 || number >= 20) {
			word = `${word}${tens[Math.floor(number / 10)]} `;
			number %= 10;
		}

		if (number >= 1 && number <= 9) {
			word = `${word}${units[number]} `;
		}

		return word;
	}
}
