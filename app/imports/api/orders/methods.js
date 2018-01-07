import { Meteor } from 'meteor/meteor';
import { orderCollection } from './model.js';
import { check } from 'meteor/check';
import { isSignedIn } from '/imports/lib/isSignedIn.js';
import { jobQueue } from '/imports/api/jobQueue';
import { parse } from '/imports/lib/parse';

Meteor.methods({
	cleanOrder: (orderNo) => {
		if (!isSignedIn()) return undefined;
		if (orderNo == "all") {
			console.log('removing all orders ');
			orderCollection.remove({ });
			return undefined;
		}
		if (orderNo) {
			console.log('removing order ', orderNo);
			orderCollection.remove({ orderNo: { $eq: orderNo } });
			return undefined;
		}
	},
	toggleOrderIsSelected: (orderNo) => {
		check(orderNo, String);
		if (!isSignedIn()) return undefined;
		const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (doc) {
			console.log('toggle found', doc._id, doc.orderNo );
			doc.isSelected = (doc.isSelected=="1") ? "0" : "1";
			orderCollection.update({ _id: doc._id }, doc);
		}
	},
	'select all': () => orderCollection.update({}, { $set: { isSelected: '1' } }, { multi: true }),

	'select none': () => orderCollection.update({}, { $set: { isSelected: '0' } }, { multi: true }),

	'select todays': (d) => {
		const delivery = parse.dates(d);
		orderCollection.update({ $and: [ { deliveryDateChecked: { $lte: delivery } }, { isShipped: { $eq: '0' } } ] }, { $set: { isSelected: '1' } }, { multi: true });
	},

	fixOrderNo: () => {
		orderCollection.find({ }).forEach(doc => {
			doc.orderNo = Number(doc.orderNo);
			console.log(doc._id, doc.orderNo);
			orderCollection.update({ _id: doc._id }, doc);
		});
	},

	fixDeliveryDate: () => {
		orderCollection.find({ }).forEach(doc => {
			doc.deliveryDateChecked = parse.dates(doc.deliveryDate);
			orderCollection.update({ _id: doc._id }, doc);
		});
	},

	toggleOrderIsShipped: (orderNo) => {
		check(orderNo, String);
		if (!isSignedIn()) return undefined;
		const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (doc) {
			doc.isShipped = (doc.isShipped=="1") ? "0" : "1";
			orderCollection.update({ _id: doc._id }, doc);
		}
	},
	storeOrderModified: (orderNo, reqChanges) => {
		check(orderNo, String);
		check(reqChanges, Object);
		if (!isSignedIn()) return undefined;
		check(orderNo, String);
		check(reqChanges, Object);
		const oldDoc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (oldDoc) {
			const changes = _.pick(reqChanges, 'shipAddress', 'deliveryTo', 'deliveryFrom', 'specialMessage');
			const newDoc = { ...oldDoc, ...changes };
			if (_.isEqual(oldDoc, newDoc)) return undefined;
			newDoc.isModified = "1";
			orderCollection.update({ _id: oldDoc._id }, newDoc );
			console.log('Stored modifications ', orderNo, JSON.stringify(changes, undefined, 2));
			Meteor.call('locate order', newDoc.orderNo);
		}
	},

})
