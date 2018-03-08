import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { orders } from '/imports/api/orders';
import { select } from '/imports/lib/select';
import { parse } from '/imports/lib/parse';
import moment from 'moment';

Template.orderEdit.onCreated(function () {
	const self = this;
	const orderNo = Number(FlowRouter.getParam('orderNo'));
	self.autorun(function() {
		self.subscribe('orders', { orderNo }, { skip: 0, limit: 1, sort: { orderNo: 1 } });
	});
});

Template.orderEdit.helpers({
	orderCollection: () => orders.orderCollection,
	orderSpec: () => orders.orderSpec,
	orderNo: () => FlowRouter.getParam('orderNo'),
	isCreateOrUpdate: () => (FlowRouter.getParam('orderNo')=="New") ? 'Create' : 'Update',
	isDeleteHidden: () => (FlowRouter.getParam('orderNo')=="New") ? 'uk-hidden' : '',
	orderDoc: () => {
		const orderNo = Number(FlowRouter.getParam('orderNo'));
		return orders.orderCollection.findOne({ orderNo });
	},
});


function docToForm(doc) {
	// break out the shipAddress array into three fields deliveryName, deliveryBusiness and deliveryAddress
	if (_.isArray(doc.shipAddress)) {
		const n = doc.shipAddress.length;
		doc.deliveryName = _.first(doc.shipAddress);
		doc.deliveryAddress = _.last(doc.shipAddress, n-1).join(', ');
		if (n>3) {
			doc.deliveryBusiness = doc.shipAddress[1];
			doc.deliveryAddress = _.last(doc.shipAddress, n-2).join(', ');
		}
	}
	return doc;
}

function formToDoc(doc) {
	// recompose the shipAddress array from three fields deliveryName, deliveryBusiness and deliveryAddress
	if (doc) {
		if (!doc.deliveryName) doc.deliveryName = "Unknown";
		const address = _.isString(doc.deliveryAddress)? doc.deliveryAddress.split(', ') : [ ];
		doc.shipAddress = _.compact([doc.deliveryName, doc.deliveryBusiness, ...address]);
	}
	// if (doc && _.isString(doc.deliveryDate)) {
	// 	doc.deliveryDateChecked = parse.dates(doc.deliveryDate);
	// }
	return doc;
}

function formToModifier(modifier) {
	return {
		'$set': formToDoc(modifier['$set']),
		'$unset': modifier['$unset'],
	}
}

AutoForm.addHooks('orderEditForm', { docToForm, formToDoc, formToModifier });

Template.orderEdit.events({
	'click .js-submit'(event, instance) {
		const orderNo = FlowRouter.getParam('orderNo');
		const modifier = AutoForm.getFormValues('orderEditForm');
		Meteor.call('storeOrderEdit', orderNo, modifier);
	},
	'click .js-delete'(event, instance) {
		const orderNo = FlowRouter.getParam('orderNo');
		Meteor.call('cleanOrder', orderNo);
	},
	'click .js-cancel'(event, instance) {
	},
});
