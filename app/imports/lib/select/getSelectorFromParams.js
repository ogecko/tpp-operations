import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';

/**
 * @summary create a mongodb selector from URL query parameters
 *
 * This function uses a definition structure to determine what URL query parameters to fetch
 * and combine. The result is formatted so that it can be used as a MongoDb find selector
 * or as a MongoDb aggregator match.
 *
 * The definition is organised as an array of objects that define each selector operation
 *
 * @param {defn[]}  defns 		Array of definitions of parameters in the selector
 * @param {string} 	defn.param  URL query parameter
 * @param {string} 	defn.field  Optional doc field name (if none then use param as field name)
 * @param {string} 	defn.operator MongoDB selector operation eg $eq, $in, $regex
 *
 * This function depends on the following packages
 *    FlowRouter - to get the current state of URL query parameters
 *
 * @example <caption>Example defns</caption>
 * URL: https://www.ogecko.com/sample?variety=shiraz&vintage=2015|2016&supplier=DanMurphys&title=Barwang
 * defn: [
 *		{ param: 'variety', operator: '$eq' },
 *		{ param: 'vintage', operator: '$in' },
 *		{ param: 'supplier', field: 'suppliers.name', operator: '$eq' },
 *		{ param: 'title', operator: '$regex' },
 *	]
 * @example <caption>Return result</caption>
 * {
 * 	variety: 		"shiraz",
 * 	vintage: 		{ "$in": ["2015","2016"] },
 * 	suppliers.name: "DanMurphys",
 * 	title: 			{ "$regex": "Barwang", "$options": "i" }
 * }
 */
export function _getSelectorFromParams(defns) {
	return _.reduce(defns, (memo, defn) => {
		let value = FlowRouter.getQueryParam(defn.param) || FlowRouter.getParam(defn.param);
		if (value) {
			const field = defn.field ? defn.field : defn.param;
			switch (defn.operator) {
				case '$exists': 	memo[field] = { $exists: value }; break;
				case '$eq': 		memo[field] = { $eq: value }; break;
				case '$in': 		memo[field] = { $in: value.split('|') }; break;
				case '$regex': 		memo[field] = { $regex: value, $options: 'i' }; break;
				case '$lunr': 		memo[field] = { $lunr: value }; break;
			}
		}
		return memo;
	}, {});
}
