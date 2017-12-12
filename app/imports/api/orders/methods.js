import { Meteor } from 'meteor/meteor';
import { orderCollection } from './model.js';
import { check } from 'meteor/check'
import { isSignedIn } from '/imports/lib/isSignedIn.js';

Meteor.methods({
	cleanOrder: (orderNo) => {
		check(orderNo, String);
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
		const doc = orderCollection.findOne({ orderNo });
		if (doc) {
			doc.isSelected = (doc.isSelected=="1") ? "0" : "1";
			orderCollection.update({ orderNo }, doc);
		}
	},
	'select all': () => orderCollection.update({}, { $set: { isSelected: '1' } }, { multi: true }),

	'select none': () => orderCollection.update({}, { $set: { isSelected: '0' } }, { multi: true }),

	toggleOrderIsShipped: (orderNo) => {
		check(orderNo, String);
		if (!isSignedIn()) return undefined;
		const doc = orderCollection.findOne({ orderNo });
		if (doc) {
			doc.isShipped = (doc.isShipped=="1") ? "0" : "1";
			orderCollection.update({ orderNo }, doc);
		}
	},
	storeOrderModified: (orderNo, reqChanges) => {
		check(orderNo, String);
		check(reqChanges, Object);
		if (!isSignedIn()) return undefined;
		check(orderNo, String);
		check(reqChanges, Object);
		const oldDoc = orderCollection.findOne({ orderNo });
		if (oldDoc) {
			const changes = _.pick(reqChanges, 'shipAddress', 'deliveryTo', 'deliveryFrom', 'specialMessage');
			const newDoc = { ...oldDoc, ...changes };
			if (_.isEqual(oldDoc, newDoc)) return undefined;
			newDoc.isModified = "1";
			orderCollection.update({ orderNo }, newDoc );
			console.log('Stored modifications ', orderNo, JSON.stringify(changes, undefined, 2));
		}
	},

})
