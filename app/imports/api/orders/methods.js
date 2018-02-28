import { Meteor } from 'meteor/meteor';
import { orderCollection } from './model.js';
import { check } from 'meteor/check';
import { isSignedIn } from '/imports/lib/isSignedIn.js';
import { jobQueue } from '/imports/api/jobQueue';
import { parse } from '/imports/lib/parse';
import { getNewOrderNo } from './getNewOrderNo.js';
import moment from 'moment';

Meteor.methods({
	orderEdit: (doc) => {
		console.log('orderEdit:', JSON.stringify(doc,undefined,2));
	},
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
			orderCollection.remove({ orderNo: { $eq: Number(orderNo) } });
			return undefined;
		}
	},
	toggleOrderIsSelected: (orderNo) => {
		check(orderNo, String);
		if (!isSignedIn()) return undefined;
		const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (doc) {
			doc.isSelected = (doc.isSelected=="1") ? "0" : "1";
			console.log(`toggle order ${doc.orderNo} to isSelected = ${doc.isSelected}`);
			orderCollection.update({ _id: doc._id }, { $set: doc });
		}
	},
	'select all': () => orderCollection.update({}, { $set: { isSelected: '1' } }, { multi: true }),

	'select none': () => orderCollection.update({}, { $set: { isSelected: '0' } }, { multi: true }),

	'select todays': (d) => {
		const delivery = parse.dates(d);
		orderCollection.update({}, { $set: { isSelected: '0' } }, { multi: true });
		orderCollection.update({ $and: [ { deliveryDateChecked: { $lte: delivery } }, { isShipped: { $eq: '0' } } ] }, { $set: { isSelected: '1' } }, { multi: true });
	},

	'select date': (d, includeShipped) => {
		const delivery = parse.dates(d);
		const isShipped = includeShipped ? { $exists: true } : { $eq : '0' };
		orderCollection.update({ $and: [ { deliveryDateChecked: { $eq: delivery } }, { isShipped } ] }, { $set: { isSelected: '1' } }, { multi: true });
	},

	'assign none': () => orderCollection.update({}, { $unset: { driver: '' } }, { multi: true }),

	'assign driver': (orderNo, driver) => orderCollection.update({ orderNo: { $eq: Number(orderNo) } }, { $set: { driver } }, { multi: true }),

	'assign selected': (driver) => orderCollection.update({ isSelected: '1' }, { $set: { driver } }, { multi: true }),

	fixOrderNo: () => {
		orderCollection.find({ }).forEach(doc => {
			doc.orderNo = Number(doc.orderNo);
			console.log(doc._id, doc.orderNo);
			orderCollection.update({ _id: doc._id }, { $set: doc });
		});
	},

	fixDeliveryDate: () => {
		orderCollection.find({ }).forEach(doc => {
			doc.deliveryDateChecked = parse.dates(doc.deliveryDate);
			orderCollection.update({ _id: doc._id }, { $set: doc });
		});
	},

	toggleOrderIsShipped: (orderNo) => {
		check(orderNo, String);
		if (!isSignedIn()) return undefined;
		const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (doc) {
			doc.isShipped = (doc.isShipped=="1") ? "0" : "1";
			orderCollection.update({ _id: doc._id }, { $set: doc });
		}
	},
	storeOrderModified: (orderNo, reqChanges) => {
		if (!isSignedIn()) return undefined;
		check(orderNo, String);
		check(reqChanges, Object);
		const oldDoc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (oldDoc) {
			const changes = _.pick(reqChanges, 'shipAddress', 'deliveryTo', 'deliveryFrom', 'specialMessage');
			const newDoc = { ...oldDoc, ...changes };
			if (_.isEqual(oldDoc, newDoc)) return undefined;
			newDoc.isModified = "1";
			orderCollection.update({ _id: oldDoc._id }, { $set: newDoc } );
			console.log('Stored modifications ', orderNo, JSON.stringify(changes, undefined, 2));
			Meteor.call('locate order', newDoc.orderNo);
		}
	},
	storeOrderEdit: (orderNo, modifier) => {
		if (Meteor.isServer) {
			if (!isSignedIn()) return undefined;
			check(orderNo, String);
			check(modifier, Object);
			const oldDoc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
			if (oldDoc) {
				orderCollection.update({ _id: oldDoc._id }, modifier.updateDoc );
				Meteor.call('locate order', Number(orderNo));
				console.log('Stored modifications ', orderNo, JSON.stringify(modifier.updateDoc, undefined, 2));
				return orderNo
			} else {
				modifier.insertDoc.orderNo = getNewOrderNo();
				modifier.insertDoc.isSelected = '1';
				modifier.insertDoc.orderDate = moment().format('DD MMM YY');
				orderCollection.insert(modifier.insertDoc );
				Meteor.call('locate order', Number(orderNo));
				console.log('Stored creation ', orderNo, JSON.stringify(modifier.insertDoc, undefined, 2));
				return modifier.insertDoc.orderNo
			}

		}
	},
})
