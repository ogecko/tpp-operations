import { Meteor } from 'meteor/meteor';

export const Counter = {
	collection: new Meteor.Collection('counters-collection'),
	get(name) {
		const doc = Counter.collection.findOne(name);
		if (doc) {
			return doc.count;
		}
		return 0;
	},
	groups(name) {
		const doc = Counter.collection.findOne(name);
		if (doc && doc.groups) {
			return doc.groups;
		}
		return [];
	},
	pages(name, itemsPerPage) {
		const doc = Counter.collection.findOne(name);
		if (doc && doc.count > 1) {
			return Math.floor((doc.count - 1) / itemsPerPage, 10) + 1;
		}
		return 1;
	},
};
