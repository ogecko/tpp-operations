import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

SimpleSchema.extendOptions(['autoform']);

const shipLocationSpec = new SimpleSchema({
	lat:					{ type: Number },
	lng:					{ type: Number },
	geoAddr:				{ type: String },
	partial:				{ type: String, optional: true, },
});

export const orderSpec = new SimpleSchema({
	orderNo:				{ type: Number,  },
	orderDate:				{ type: String, optional: true, },
	isShipped:				{ type: String, optional: true, },
	isSelected:				{ type: String, optional: true, },
	driver:					{ type: String, optional: true, },
	customerName: {
		type: String, optional: true, 
		autoform: { label: 'Name', 'formgroup-class': 'uk-width-1-4@s'},
	},
	customerEmail: {
		type: String, optional: true, regEx: SimpleSchema.RegEx.Email,
		autoform: { type: "email", label: 'Email', 'formgroup-class': 'uk-width-1-2@s' },
  	},
	customerPhone: { 
		type: String, optional: true, 
		autoform: { type: 'tel', label: 'Phone', 'formgroup-class': 'uk-width-1-4@s'},
	},
	productCode:			{ 
		type: String, optional: true, 
		autoform: { 'formgroup-class': 'uk-width-1-4@s'},
	},
	amount:					{
		type: String, optional: true, 
		autoform: { 'formgroup-class': 'uk-width-1-4@s'},
	},
	deliveryDate: {
		type: String, optional: true,
		autoform: { label: 'Delivery Date(s)', 'formgroup-class': 'uk-width-1-4@s'},
	},
	deliveryDateChecked:	{ type: Date, optional: true, },
	deliveryName: {
		type: String, optional: true,
		autoform: { label: 'Name', 'formgroup-class': 'uk-width-1-4@s'},
  	},
	deliveryBusiness: {
		type: String, optional: true,
		autoform: { label: 'Business / Unit / Level / Suite', 'formgroup-class': 'uk-width-1-4@s'},
  	},
	deliveryAddress: {
		type: String, optional: true,
		autoform: { rows: 2, label: 'Address', 'formgroup-class': 'uk-width-1-2@s'},
  	},
	shipAddress:			{ type: Array, optional: true, },
	'shipAddress.$':		{ type: String },
	shipLocation:			{ type: shipLocationSpec, optional: true, },
	shipInstructions: {
		type: String, optional: true, 
		autoform: { rows: 2, 'formgroup-class': 'uk-width-1-2@s'},
  	},
	deliveryTo: {
		type: String, optional: true,
		autoform: { label: 'A Posy For', 'formgroup-class': 'uk-width-1-4@s'},
  	},
	specialMessage:	{
		type: String, optional: true, 
		autoform: { rows: 2, 'formgroup-class': 'uk-width-1-2@s'},
  	},
	deliveryFrom: {
		type: String, optional: true,
		autoform: { label: "From", 'formgroup-class': 'uk-width-1-4@s'},
  	},

}, { tracker: Tracker });


export const orderCollection = new Mongo.Collection('orders');
orderCollection.attachSchema(orderSpec);
// orderCollection.allow({
// 	insert: (userId, doc) => userId, 
// 	update: (userId, doc) => userId, 
// 	remove: (userId, doc) => false,  
// })

export const orderFilterFields = [
	{ label: 'Order Number', param: 'order', field: 'orderNo', limit: 8, operator: '$eq' },
	{ label: 'Buyer Name', param: 'name', limit: 8, operator: '$regex' },
	{ label: 'Shipped', param: 'shipped', field: 'isShipped', limit: 8, operator: '$eq' },
	{ label: 'Modified', param: 'modified', field: 'isModified', limit: 8, operator: '$eq' },
	{ label: 'Selected', param: 'selected', field: 'isSelected', limit: 8, operator: '$eq' },
	{ label: 'Special Message', param: 'msg', field: 'specialMessage', limit: 8, operator: '$regex' },
	{ label: 'Paid', param: 'isPaid', limit: 8, operator: '$in' },
	{ label: 'Delivery', param: 'delivery', field: 'deliveryDateChecked', limit: 8, operator: '$eq' },
	{ label: 'Driver', param: 'driver', field: 'driver', limit: 8, operator: '$eq' },
	{ param: 'q', field: 'orderNo', operator: '$lunr' }                   // used for lunr searches
];

export const orderIndexFields = {
	name: 'orders',
	collection: orderCollection,
	fields: [
		{ key: 'orderNo', ref: true, boost: 10, mutate: x => x.toString(), },
		{ key: 'customerName' },
		{ key: 'shipAddress', mutate: x => x.join(' '), },
	],
};

