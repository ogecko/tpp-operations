import { Meteor } from 'meteor/meteor';
import { orderCollection } from './model.js';
import { check } from 'meteor/check'

Meteor.methods({
	cleanOrder: (orderNo) => {
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
	// checkOrders: () => {
	// 	if (Meteor.isServer) {
	// 		orderCollection.find({ }).forEach(doc => {
	// 			if (_.isNumber(doc.orderNo)) {
	// 				const doc2 = orderCollection.findOne({ orderNo: doc.orderNo+'' });
	// 				if (doc2) orderCollection.remove( { id:doc.id });
	// 				if (!doc2) orderCollection.update( { id:doc.id }, { $set: { orderNo: doc.orderNo+'' }});
	// 				console.log('Number', doc.orderNo, 'No String ver', !doc2);
	// 			}
	// 			if (_.isString(doc.orderNo)) {
	// 				console.log('String', doc.orderNo);
	// 			}
	// 		});
	// 	}
	// },
	toggleOrderIsSelected: (orderNo) => {
		const doc = orderCollection.findOne({ orderNo });
		if (doc) {
			doc.isSelected = (doc.isSelected=="1") ? "0" : "1";
			orderCollection.update({ orderNo }, doc);
		}
	},
	toggleOrderIsShipped: (orderNo) => {
		const doc = orderCollection.findOne({ orderNo });
		if (doc) {
			doc.isShipped = (doc.isShipped=="1") ? "0" : "1";
			orderCollection.update({ orderNo }, doc);
		}
	},
	storeOrderModified: (orderNo, reqChanges) => {
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
	}

})
