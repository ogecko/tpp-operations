export function isHtml(str) {
	const quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;

	// ensure str is a string
	if ((typeof str) !== 'string') return false;

	// Faster than running regex, if str starts with `<` and ends with `>`, assume it's HTML
	if (str.charAt(0) === '<' && str.charAt(str.length - 1) === '>' && str.length >= 3) return true;

	// Run the regex
	const match = quickExpr.exec(str);
	return !!(match && match[1]);
}
