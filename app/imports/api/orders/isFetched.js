import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { orderCollection } from './model.js';
import { methods } from './methods.js';

export function isFetched(orderNo) {
	check(orderNo, Number);
	const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
	return (doc && doc.specialMessage) ? true : false;
}