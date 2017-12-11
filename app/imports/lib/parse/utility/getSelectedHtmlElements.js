import { check } 			from 'meteor/check';
import cheerio				from 'cheerio';
import { isHtml }			from './isHtml.js';

export function getSelectedHtmlElements($, srcField, selector) {
	check(srcField, Object);
	check(selector, String);

	let srcElements;

	// if the source is HTML then parse and select it
	if (isHtml(srcField.value)){
		srcElements = cheerio.load(srcField.value)(selector);

	// if there is no selector then just return the current source dom
	} else if (selector === '') {
		srcElements = $(srcField.value);

	// otherwise return the selection from within the source dom
	} else {
		srcElements = $(selector, srcField.value);
	}

	return srcElements;
}
