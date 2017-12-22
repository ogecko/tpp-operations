import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { orderCollection } from './model.js';


export function update(newDoc) {
	check(newDoc.orderNo, Number);

	// handle updating an array of docs
	if (_.isArray(newDoc)) {
		return _.each(newDoc, d => update(d));
	}

	// try and find any existing order matching it
	const oldDoc = orderCollection.findOne({ orderNo: newDoc.orderNo });

	return !oldDoc
		? orderCollection.insert(newDoc)
		: orderCollection.update({ _id: oldDoc._id	}, { $set: { ...oldDoc, ...newDoc, isModified: '0' } });

}