import { check, Match } 			from 'meteor/check';
import numeral 						from 'numeral';
import { unescapeHtml } from './unescapeHtml.js';

export function getValuesOfElements($, tgtFieldType, srcElement, attrName) {
	check(tgtFieldType, String);
	check(attrName, Match.Optional(String));

	if (tgtFieldType.search(/^Array_/) === 0) {
		const elmFieldType = tgtFieldType.slice(6);
		const res = [];
		if (elmFieldType === 'dom') {
			srcElement.each((i, elm) => res.push({ dom: $(elm) }));	// push objects with dom key
		} else {
			srcElement.each((i, elm) => res.push(getValuesOfElements($, elmFieldType, $(elm), attrName)));		// push indiv results
		}
		return res;
	} else {
		let value = '';
		let res = `Unable to extract from '${srcElement.eq(0).text()}'`;
		const isElementWithVal = ( srcElement.is('input') || srcElement.is('textarea') || srcElement.is('select') );

		// extract the string from the html
		if (attrName) {
			value = srcElement.attr(attrName);
		} else if (isElementWithVal) {
			value = srcElement.val();
		} else if (tgtFieldType === 'length') {
			value = srcElement.length;
		} else if (tgtFieldType === 'html') {
			value = unescapeHtml(srcElement.html());
		} else {
			value = srcElement.eq(0).text();
		}

		// convert to the target format
		if (tgtFieldType === 'Number') {
			res = (value) ? numeral().unformat(value.trim().split('\n')[0]) : undefined;		// only look at first line
		} else if (tgtFieldType === 'Date') {
			res = new Date(value);
		} else if (tgtFieldType === 'dom') {
			res = srcElement;
		} else {
			res = value;
		} return res;
	}
}


