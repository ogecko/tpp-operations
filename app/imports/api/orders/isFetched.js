import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { orderCollection } from './model.js';
import { methods } from './methods.js';

export function isFetched(orderNo) {
	const doc = orderCollection.findOne({ orderNo });
	return (doc && doc.shipTo) ? true : false;
}