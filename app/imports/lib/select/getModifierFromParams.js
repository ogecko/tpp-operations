import { FlowRouter } from 'meteor/kadira:flow-router';
import { decodeSortBy } from '/imports/lib/decode.js';
import { DEFAULT_ITEMS_PER_PAGE } from './defaultItemsPerPage.js';
import numeral from 'numeral';
/**
 * @summary create a mongodb modifier from URL query parameters
 *
 * This function fetches the values of some standard URL query parameters (p,pp, and s)
 * These are then formatted so that it can be used as a MongoDb find modifer.
 *
 * This function depends on the following packages
 *    FlowRouter - to get the current state of URL query parameters
 *
 * @example <caption>Example URL</caption>
 * URL: https://www.ogecko.com/sample?p=5&pp=50&s=price:des
 *
 * @example <caption>Return result</caption>
 * {
 * 	limit: 		50,
 * 	skip: 		200,
 * 	sort: 		{"price": -1},
 * }
 */
export function _getModifierFromParams() {
	const page = FlowRouter.getQueryParam('p') || 1;
	const perPage = numeral(FlowRouter.getQueryParam('pp')).value() || DEFAULT_ITEMS_PER_PAGE;
	const sort = decodeSortBy(FlowRouter.getQueryParam('s') || 'orderNo:des');

	return {
		limit: perPage,
		skip: (page - 1) * perPage,
		sort: { [sort.field]: sort.order },
	};
}
