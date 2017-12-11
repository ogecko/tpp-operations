import { _ } from 'meteor/underscore';
import { toTitleCase } from '/imports/lib/changeCase.js';

// Example MongoDB aggregation queries
// db.wines.aggregate([
//     {$match: {variety: 'shiraz'}},
//     {$unwind: '$suppliers'},
//     {$group: {_id: '$suppliers.name', count: {$sum: 1}}},
//     {$sort: {count:-1}}
// ])
// db.wines.aggregate([
//     {$match: {'vintage': '2014'},
//     {$group: {_id: "$variety", count: {$sum: 1}}},
//     {$sort: {count:-1}}
// ])


export function countGroups(collection, match, defns) {
	const n = countTotal(collection, match);
	return {
		count: n,
		groups: _.chain(defns)
			.filter(defn => defn.label)			// only count groups that have a label
			.map(defn => countGroup(collection, match, defn, n))
			.filter(group => group.items && group.items.length > 1)	// ignore any with only one entry
			.value(),
	};
}

function countTotal(collection, match) {
	return collection.find(match).count();
}

function countGroup(collection, match, defn, total) {
	const pipeline = [];
	const gField = defn.field || defn.param;
	const gLimit = defn.limit;
	const gSort = defn.sort || { count: -1 };

	// create an aggregation pipeline definition based on defn
	pipeline.push({ $match: _.omit(match, gField) });
	if (gField.includes('.')) {
		pipeline.push({ $unwind: '$' + gField.split('.')[0] });
	}
	pipeline.push({ $group: { _id: '$' + gField, count: { $sum: 1 } } });
	pipeline.push({ $sort: gSort });
	if (gLimit) {
		pipeline.push({ $limit: gLimit });
	}

	// ask MongoDB to do the agregation
	const results = _.filter(collection.aggregate(pipeline), item => (item._id !== null));

	// limit the number of items by grouping all small ones in "Other"
	if (gLimit) {
		const gTotal = _.reduce(results, (m, x) => m + x.count, 0);
		if (gTotal < total) {
			results.push({ _id: 'Other', count: total - gTotal });
		}
	}

	// return the result formatted so it can be used as input to filterBy control
	return {
		label: defn.label,
		param: defn.param,
		items: _.map(results, (item) => ({
			label: toTitleCase(item._id),
			value: item._id,
			count: item.count,
		})),
	};
}

