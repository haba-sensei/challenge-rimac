export default class StringsUtils {
	static convertToCamelCase(input: string): string {
		const words = input.split(" ");
		const camelCaseWords = words.map((word, index) => {
			if (index === 0) {
				return word.toLowerCase();
			}
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		});
		return camelCaseWords.join("");
	}
}
