import { Nightmare } from './nightmare.js';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';

Meteor.methods({
	'fetch': (orderNo) => {
		jobQueue.dispatch('fetch', { orderNo: orderNo }, { retries: 3, wait: 10*1000 })
	},
	'fetch list': () => {
		jobQueue.dispatch('fetch list', { }, { retries: 3, wait: 10*1000 })
	},
	'fetch at': (offset) => {
		jobQueue.dispatch('fetch at', { orderNo: offset }, { retries: 3, wait: 10*1000 })
	},
	'fetch upto': (top) => {
		_.each(_.range(0,top,20), offset => {
			jobQueue.dispatch('fetch at', { orderNo: offset }, { retries: 3, wait: 10*1000 })
		});
	},
	'location all': () => {
		orders.orderCollection.find({}).forEach(doc => {
			jobQueue.dispatch('location', { orderNo: doc.orderNo }, { retries: 3, wait: 10*1000 })
		});
	},
})
