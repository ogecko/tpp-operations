import { _ } from 'meteor/underscore';

export function _getScopeFromDefns(defns) {
	return _.chain(defns)
			.filter(defn => (defn.label))
			.map(defn => defn.param)
			.join('|')
			.value();
}
