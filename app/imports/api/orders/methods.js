import { Meteor } from 'meteor/meteor';
import { orderCollection } from './model.js';
import { check } from 'meteor/check';
import { isSignedIn } from '/imports/lib/isSignedIn.js';
import { jobQueue } from '/imports/api/jobQueue';
import { parse } from '/imports/lib/parse';
import { getNewOrderNo } from './getNewOrderNo.js';
import { updateBulkOrder } from './updateBulkOrder.js';
import { getDeliveries, getIsShippedAll, setDeliveryShipment, toggleDeliveryShipment, getNextDeliveryShipment } from './getDeliveries.js';
import moment from 'moment';

Meteor.methods({
	cleanOrder: (orderNo) => {
		check(orderNo, String);
		if (!isSignedIn()) return undefined;
		if (orderNo == "all") {
			orderCollection.remove({ });
			console.log('Removed all orders');
			return undefined;
		}
		if (orderNo) {
			orderCollection.remove({ orderNo: { $eq: Number(orderNo) } });
			console.log(`Removed order ${orderNo}`);
			return undefined;
		}
	},
	toggleOrderIsSelected: (orderNo) => {
		check(orderNo, String);
		if (!isSignedIn()) return undefined;
		const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (doc) {
			doc.isSelected = (doc.isSelected=="1") ? "0" : "1";
			orderCollection.update({ _id: doc._id }, { $set: doc });
			console.log(`Toggled order ${doc.orderNo} to ${doc.isSelected=='1'?'selected':'unselected'}`);
		}
	},
	'select all': () => {
		orderCollection.update({}, { $set: { isSelected: '1' } }, { multi: true });
		console.log(`Selected all orders`);
	},

	'select none': () => {
		orderCollection.update({}, { $set: { isSelected: '0' } }, { multi: true });
		console.log(`Cleared all selections`);
	},

	'select todays': (d) => {
		const targetDate = parse.dates(d);
		orderCollection.update({}, { $set: { isSelected: '0' } }, { multi: true });
		orderCollection.update({ deliveries: { $elemMatch: { date: { $lte: targetDate }, isShipped: { $eq: false } } } }, 
			{ $set: { isSelected: '1' } }, { multi: true });
		console.log(`Selected Todays Deliveries ${targetDate}`);
	},

	'select date': (d, includeShipped) => {
		const targetDate = parse.dates(d);
		const isShipped = includeShipped ? { $exists: true } : { $eq: false };
		orderCollection.update({ deliveries: { $elemMatch: { date: { $eq: targetDate }, isShipped } } }, 
			{ $set: { isSelected: '1' } }, { multi: true });
		console.log(`Selected Deliveries by Date ${targetDate}${includeShipped?', including shipped':''}`);
	},

	'select multi': () => {
		orderCollection.update({}, { $set: { isSelected: '0' } }, { multi: true });
		orderCollection.update({ "deliveries.1": { $exists: true } }, 
			{ $set: { isSelected: '1' } }, { multi: true });
		console.log(`Selected Orders with multiple Deliveries`);
	},

	'assign none': () => {
		orderCollection.update({}, { $unset: { driver: '' } }, { multi: true });
		console.log(`Assigned all orders to no driver`);
	},

	'assign driver': (orderNo, driver) => {
		orderCollection.update({ orderNo: { $eq: Number(orderNo) } }, { $set: { driver } }, { multi: true });
		console.log(`Assigned order ${orderNo} to ${driver}`);
	},

	'assign selected': (driver) => {
		orderCollection.update({ isSelected: '1' }, { $set: { driver } }, { multi: true });
		console.log(`Assigned selected orders to ${driver}`);
	},

	updateBulkOrder: (fileName, fileContents) => {
		if (Meteor.isServer) {
			check(fileName, String);
			check(fileContents, String);
			return updateBulkOrder(fileName, fileContents);
		}
	},

	toggleOrderDeliveryShipment: (orderNo, id) => {
		check(orderNo, String);
		check(id, String);
		if (!isSignedIn()||Meteor.isClient) return undefined;
		const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (doc) {
			doc.deliveryDate = toggleDeliveryShipment(doc.deliveryDate, Number(id));
			doc.deliveries = getDeliveries(doc.deliveryDate);
			doc.isShipped = getIsShippedAll(doc.deliveryDate);
			orderCollection.update({ _id: doc._id }, { $set: doc });
			console.log(`Toggled order ${doc.orderNo} deliveries as ${doc.deliveryDate}`);
		}
	},

	setOrderDeliveryShipment: (orderNo) => {
		check(orderNo, Number);
		if (!isSignedIn()||Meteor.isClient) return undefined;
		const doc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
		if (doc) {
			const nextDeliveryShipment = getNextDeliveryShipment(doc.deliveryDate)
			doc.deliveryDate = setDeliveryShipment(doc.deliveryDate);
			doc.deliveries = getDeliveries(doc.deliveryDate);
			doc.isShipped = getIsShippedAll(doc.deliveryDate);
			orderCollection.update({ _id: doc._id }, { $set: doc });
			console.log(`SetOrderDeliveries ${doc.orderNo}/${nextDeliveryShipment} deliveries as ${doc.deliveryDate}`);
			return nextDeliveryShipment;
		}
	},

	storeOrderEdit: (orderNo, modifier) => {
		if (Meteor.isServer) {
			if (!isSignedIn()) return undefined;
			check(orderNo, String);
			check(modifier, Object);
			const oldDoc = orderCollection.findOne({ orderNo: { $eq: Number(orderNo) } });
			if (oldDoc) {
				modifier.updateDoc.$set.deliveries = getDeliveries(modifier.updateDoc.$set.deliveryDate);
				modifier.updateDoc.$set.isShipped = getIsShippedAll(modifier.updateDoc.$set.deliveryDate);
				orderCollection.update({ _id: oldDoc._id }, modifier.updateDoc );
				Meteor.call('locate order', Number(orderNo));
				console.log('Edited Order ', orderNo, JSON.stringify(modifier.updateDoc, undefined, 2));
				return orderNo
			} else {
				modifier.insertDoc.orderNo = getNewOrderNo();
				modifier.insertDoc.isSelected = '1';
				modifier.insertDoc.isShipped = '0';
				modifier.insertDoc.orderDate = moment().format('DD MMM YY');
				modifier.insertDoc.deliveries = getDeliveries(modifier.insertDoc.deliveryDate);
				modifier.insertDoc.isShipped = getIsShippedAll(modifier.insertDoc.deliveryDate);
				orderCollection.insert(modifier.insertDoc );
				Meteor.call('locate order', Number(orderNo));
				console.log('Created Order ', orderNo, JSON.stringify(modifier.insertDoc, undefined, 2));
				return modifier.insertDoc.orderNo
			}

		}
	},

	fixOrderNo: () => {
		orderCollection.find({ }).forEach(doc => {
			doc.orderNo = Number(doc.orderNo);
			console.log(doc._id, doc.orderNo);
			orderCollection.update({ _id: doc._id }, { $set: doc });
		});
	},

	fixDeliveryDate: () => {
		orderCollection.find({ }).forEach(doc => {
			console.log(doc.orderNo);
			if (doc.isShipped=='1') doc.deliveryDate = setDeliveryShipment(doc.deliveryDate);
			doc.deliveries = getDeliveries(doc.deliveryDate);
			orderCollection.update({ _id: doc._id }, { $set: doc });
		});
	},


})
