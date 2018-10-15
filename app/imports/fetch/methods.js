import { Meteor } from 'meteor/meteor';
import { Nightmare } from './nightmare.js';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';

Meteor.methods({
	'fetch list': () => {
		jobQueue.dispatch('fetch list', { }, { retries: 3, wait: 10*1000 })
	},
	'fetch order': (orderNo) => {
		jobQueue.dispatch('fetch order', { orderNo: orderNo }, { retries: 3, wait: 10*1000 })
	},
	'ship selected': () => {
		if (Meteor.isClient) return;
		orders.orderCollection.find({ isSelected: '1' }).forEach(doc => {
			console.log('Shipping', doc.orderNo);
			const nextOrderDeliveryShipment = Meteor.call('setOrderDeliveryShipment', doc.orderNo);
			jobQueue.dispatch('ship order', { orderNo: doc.orderNo, delivery: nextOrderDeliveryShipment }, { retries: 0, wait: 10*1000 })
		});
	},
	'locate order': (orderNo) => {
		jobQueue.dispatch('locate order', { orderNo: orderNo }, { retries: 3, wait: 10*1000 })
	},
	'locate all': () => {
		if (Meteor.isClient) return;
		orders.orderCollection.find({}).forEach(doc => {
			jobQueue.dispatch('locate order', { orderNo: doc.orderNo }, { retries: 3, wait: 10*1000 })
		});
	},
})
