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
	paramCounts(name, param) {
		const groups = this.groups(name);
		const paramCounts = _.filter(groups, (g) => (g.param === param));
		if (paramCounts.length===1 && paramCounts[0].items) {
			return paramCounts[0].items;
		}
		return [];
	},
	valueCount(name, param, value) {
		const paramCounts = this.paramCounts(name, param);
		const valueCounts = _.filter(paramCounts, (item) => (item.value === value));
		if (valueCounts.length===1 && valueCounts[0].count) {
			return valueCounts[0].count;
		}
		return 0;
	},
	pages(name, itemsPerPage) {
		const doc = Counter.collection.findOne(name);
		if (doc && doc.count > 1) {
			return Math.floor((doc.count - 1) / itemsPerPage, 10) + 1;
		}
		return 1;
	},
};
