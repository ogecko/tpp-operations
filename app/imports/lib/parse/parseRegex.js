// returns the first parenthesis match of a regular expression
// returns undefined if the field is already set or there is no match

export function parseRegex(tgtField, str, re, newSubstr) {
	if (str && str.toString) {
		const matches = str.toString().match(re);
		if (!tgtField.isSet && matches) {
			return matches[0].replace(re, newSubstr);
		}
	}
	return undefined;
}
