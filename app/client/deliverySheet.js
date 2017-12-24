import { _ } from 'meteor/underscore';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';
import { select } from '/imports/lib/select';
import moment from 'moment';
import { Counter } from '/imports/lib/counter/client.js';

Template.deliverySheet.onCreated(function() {
	const self = this;
	self.autorun(function() {
		self.subscribe('orders',
			select.getSelectorFromParams(orders.orderFilterFields),
			select.getModifierFromParams()
		);
	});
});

Template.deliverySheet.onRendered(function() {
	Meteor.setTimeout(() => { 
		window.print(); 
		window.close() 
	}, 1000);
});


Template.deliverySheet.helpers({
	orders: function() {
		return orders.orderCollection.find(
			select.getSelectorFromParams(orders.orderFilterFields),
			_.pick(select.getModifierFromParams(), 'sort')
			);
	},
	numPages() {
		return { pages: Counter.pages('wc', select.DEFAULT_ITEMS_PER_PAGE), buttons: 4 };
	},
	date: d => moment(d).format('DD MMM YY'),
	today: d => moment().format('DD MMM YY'),
	shipTo: order => _.first(order.shipAddress, 1),
	addressOf: order => _.rest(order.shipAddress, 1),
	isShipped: order => (order.isShipped==='1' ? 'uk-background-muted' : 'uk-background-primary'),
});

Template.deliverySheet.events({
	'click .js-orderDetail'(event, instance) {
		// increment the counter when button is clicked
		console.log('Requesting detail on order', event.target.dataset.orderNo);
  		jobQueue.dispatch('fetch', { orderNo: event.target.dataset.orderNo }, { retries: 3, wait: 10*1000 });
	},
});

