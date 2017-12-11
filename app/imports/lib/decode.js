import { _ } from 'meteor/underscore';

export function encodeOrd(ord) {
	return (ord === 1) ? 'as' : 'des';
}

export function decodeSortBy(s) {
	const params = s.split(':');
	const field = params[0];
	const order = (params[1] && params[1].includes('des')) ? -1 : 1;
	return { field, order };
}

export function encodeSortBy(params) {
	return `${params.field}:${encodeOrd(params.order)}`;
}

// decode filter (URL query parameter value | undefined) -> (Array of Strings)
export function decodeFilterBy(v) {
	if (!v) return [];
	return v.split('|');
}

// encode filter (Array of Strings) -> (URL query parameter value | null)
export function encodeFilterBy(m) {
	const j = m.join('|');
	return (j.length === 0) ? null : j;
}

// test filter (Array of Strings) -> Bool
export function isFilterBy(m, i) {
	return _.contains(m, i);
}

// toggle filter (Array of Strings) -> (Array of Strings)
export function toggleFilterBy(m, i) {
	return isFilterBy(m, i) ? _.without(m, i) : _.union(m, [i]);
}
