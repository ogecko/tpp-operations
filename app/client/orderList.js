import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';
import { select } from '/imports/lib/select';
import { parse } from '/imports/lib/parse';
import moment from 'moment';
import { Counter } from '/imports/lib/counter/client.js';

Template.orderList.onCreated(function() {
	const self = this;
	self.autorun(function() {
		self.subscribe('orders',
			select.getSelectorFromParams(orders.orderFilterFields),
			select.getModifierFromParams()
		);
	});
});


Template.orderList.helpers({
	orders: function() {
		return orders.orderCollection.find(
			select.expandLunr('orders', select.getSelectorFromParams(orders.orderFilterFields), (x)=>parseInt(x,10)),  
			_.pick(select.getModifierFromParams(), 'sort')
			);
	},
	numItems: () => Counter.get('wc'), 
	numPages: () => ({ pages: Counter.pages('wc', FlowRouter.getQueryParam('pp')||select.DEFAULT_ITEMS_PER_PAGE), buttons: 7 }),
	date: d => moment(d).format('DD MMM YY'),
	today: d => moment().format('DD MMM YY'),
	addressOf: order => _.rest(order.shipAddress, 1),
	isShippedFormat: order => (order.isShipped==='1' ? 'uk-background-default uk-text-muted' : 'uk-background-muted'),
	isShippedMessage: order => (order.isShipped==='1' ? 'Shipped' : undefined),
	isModifiedMessage: order => (order.isModified==='1' ? 'Modified' : undefined),
	isSelectedChk: order => (order.isSelected==='1' ? 'checked' : undefined),
	isSelectedMessage: order => (order.isSelected==='1' ? 'Selected' : undefined),
	shipAddressDefault: order => order.shipAddress.join('\n'),
	cardMessageDefault: order => `A Posy For: ${order.deliveryTo}\n${order.specialMessage}\nFrom: ${order.deliveryFrom}`,
	moment: d => moment(d).format('DD-MMM-YY'),
	isTPPWebOrder: n => (n>100000),
	orderDetailLink: n => `https://www.theposyplace.com.au/web#id=${n-100000}&view_type=form&model=sale.order&menu_id=180&action=250`,
});

function inPlaceEdit(event, instance) {
	const tgt = instance.$(event.currentTarget);

	// initialize
	if (tgt.children('.in-place-edit').length===0) {
		// mark the existing content
		tgt.children().addClass('in-place-read-only');
		// create a new textarea for editing (initially hidden)
		tgt.append('<textarea class="uk-textarea uk-height-match in-place-edit" hidden></textarea>');
	}

	// grab the info that is already in the target area
	const divHeight = tgt.outerHeight();
	const lineHeight = tgt.css('lineHeight').replace(/px/, '');
	const rows = divHeight / lineHeight;
	const defaultValue = tgt.children('.in-place-read-only')
		.text()
		.replace(/ +/gm, ' ')
		.replace(/[\t]+/gm, '')
		.replace(/[\n]{2}/gm, '\n')
		.trim();

	// change to edit mode
	if (event.type==='click' && tgt.children('.in-place-edit').attr('hidden')) {
		// start editing
		tgt.children('.in-place-edit').attr('hidden', false);
		tgt.children('.in-place-edit').attr('rows', (rows>3)? rows-1 : 3);
		tgt.children('.in-place-edit').val(defaultValue);
		tgt.children('.in-place-edit').focus();
		tgt.children('.in-place-read-only').attr('hidden', true);
	}

	// change to read only mode and return the changed data
	if (event.type==='focusout' && !tgt.children('.in-place-edit').attr('hidden')) {
		// stop editing
		tgt.children('.in-place-edit').attr('hidden', true);
		tgt.children('.in-place-read-only').attr('hidden', false);
		// return the modified textarea array of strings
		return _.compact(tgt.children('.in-place-edit').val().split('\n'));
	}

	return undefined;
}

Template.orderList.events({
	'click .js-orderDetail'(event, instance) {
		console.log('Request detail data on order', event.target.dataset.orderNo);
		// Meteor.call('fetch order', event.target.dataset.orderNo);
	},
	'click .js-toggleOrderIsSelected'(event, instance) {
		const tgt = instance.$(event.currentTarget)[0];
		console.log('Toggle selected order', tgt.dataset.orderNo);
		Meteor.call('toggleOrderIsSelected', tgt.dataset.orderNo);
	},

	'click .js-orderEdit': (event, instance) => {
		const orderNo = event.currentTarget.dataset.orderNo;
		const src = FlowRouter.current().path;
		FlowRouter.go(`/order/:orderNo`, { orderNo });
	}, 

	'click .js-shipToggle'(event, instance) {
		const orderNo = event.currentTarget.dataset.orderNo;
		const id = event.currentTarget.dataset.id;
		console.log('shipToggle', orderNo, id);
		Meteor.call('toggleOrderDeliveryShipment', orderNo, id);
	},
});

