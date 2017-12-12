import { Meteor } from 'meteor/meteor';
import { methods } from './methods.js';
import { orderHistoryFetchList } from './orderHistoryFetchList.js';
import { orderHistoryFetchAt } from './orderHistoryFetchAt.js';
import { orderDetailFetch } from './orderDetailFetch.js';
import { orderLocationFetch } from './orderLocation.js';

export const fetch = {
	// all fetch methods are processed thru jobQueue with workers
}
