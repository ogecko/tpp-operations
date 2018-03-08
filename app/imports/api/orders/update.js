import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { orderCollection } from './model.js';
import { getDeliveries } from './getDeliveries.js';


export function update(newDoc) {
	// handle updating an array of docs
	if (_.isArray(newDoc)) {
		return _.each(newDoc, d => update(d));
	}

	check(newDoc.orderNo, Number);

	// expand out the deliveries 
	if (newDoc.deliveryDate) newDoc.deliveries = getDeliveries(newDoc.deliveryDate);

	// try and find any existing order matching it
	const oldDoc = orderCollection.findOne({ orderNo: newDoc.orderNo });

	return !oldDoc
		? orderCollection.insert(newDoc)
		: orderCollection.update({ _id: oldDoc._id	}, { $set: { ...oldDoc, ...newDoc, isModified: '0' } });

}