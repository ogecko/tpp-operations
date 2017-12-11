import { _ } from 'meteor/underscore';

export function toTitleCase(str) {
	if (!_.isString(str)) return undefined;
	return str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1));
}
