import { _ } from 'meteor/underscore';

export function combine(tgtField, items, separator) {
	// if the target is already set in the data structure then just leave it
	if (tgtField.isSet) return undefined;

	return _.chain(items)
		.compact()
		.map(i => i.toString().trim())
		.compact()
		.value()
		.join(separator);
}
