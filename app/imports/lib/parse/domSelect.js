import { Meteor } 					from 'meteor/meteor';
import { check, Match } 			from 'meteor/check';
import { getFieldType }				from './utility/getFieldType.js';
import { getSelectedHtmlElements }	from './utility/getSelectedHtmlElements.js';
import { getValuesOfElements }		from './utility/getValuesOfElements.js';
import cheerio						from 'cheerio';


// Used in a schema to select particular values out of the dom for a field
export function domSelect(tgtField, type, selector, attrName, preFix, postFix) {
	// confirm parameters are correct types
	check(tgtField.isSet, Boolean);
	check(selector, String);
	check(attrName, Match.Optional(String));
	check(preFix, Match.Optional(String));
	check(postFix, Match.Optional(String));

	// allow it to run on client so autoforms can be validated (but dont do anything)
	if (Meteor.isClient) return undefined;

	const tgtFieldType = getFieldType(type);
	const srcField = tgtField.siblingField('dom');
	const $ = cheerio.load('<body></body>');							// used just to get the cheerio function

	// if the target is a dom field and this is an insert or update operation then unset this field
	if ((tgtFieldType === 'dom') && (tgtField.isInsert || tgtField.isUpdate)) {
		tgtField.unset();
		return undefined;
	}

	// if the target is already set in the data structure then just leave it
	if (tgtField.isSet) return undefined;

	// if the source is undefined or not set then unset this field as they havent specified the source correctly
	if ((!srcField) || (!srcField.isSet)) {
		tgtField.unset();
		return undefined;
	}

	// Select the elements that match the CSS selector
	const srcElements = getSelectedHtmlElements($, srcField, selector);

	// return the values of the extracted elements
	let res = getValuesOfElements($, tgtFieldType, srcElements, attrName);
	if (preFix && res) res = preFix + res;
	if (postFix && res) res = res + postFix;

	return res;
}
