import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';
import { select } from '/imports/lib/select';
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.labelSheet.onCreated(function() {
	const self = this;
	self.autorun(function() {
		self.subscribe('orders',
			select.getSelectorFromParams(orders.orderFilterFields),
			select.getModifierFromParams()
		);
	});
});

Template.labelSheet.onRendered(function() {
	Meteor.setTimeout(() => { 
		window.print(); 
		window.close() 
	}, 1000);
});

Template.labelSheet.helpers({
	orders: function() {
		const docs =  orders.orderCollection.find(
			select.getSelectorFromParams(orders.orderFilterFields),
			_.pick(select.getModifierFromParams(), 'sort')
		);
		const print = []; docs.forEach((doc) => print.push(doc));
		const blanks = FlowRouter.getQueryParam('blanks');
		if (_.isString(blanks)) {
			_.each(blanks.split(''), (isBlank, id) => (isBlank==='1' && print.splice(id, 0, {})));
		}
		return print;
	},
	isLabelBlank: (id) => Template.instance().blanks.get()[id],
	msgsize: (order) => (order.specialMessage && order.specialMessage.length<200 ? 'og-label-msg1' : 'og-label-msg2'),
	date: d => d,
	isNotBlank: (order) => order.orderNo,
});

Template.labelSheet.events({
	'click js-blank'(event, instance) {
		const blanks = getIsBlanks();
		if (event.currentTarget.data.id) {
			blanks[id] = !blanks[id];
		}
		Session.set('blanks',blanks);
	},
});

