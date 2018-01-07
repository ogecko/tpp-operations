import { Meteor } from 'meteor/meteor';
import { methods } from './methods.js';
import { fetchList } from './fetchList.js';
import { fetchOrder } from './fetchOrder.js';
import { shipOrder } from './shipOrder.js';
import { locateOrder } from './locateOrder.js';

export const fetch = {
	// all fetch methods are processed thru jobQueue with workers
}
