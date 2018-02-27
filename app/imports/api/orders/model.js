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
	customerName: {
		type: String, optional: true, 
		autoform: { label: 'Name'},
	},
	orderDate:				{ type: String, optional: true, },
	amount:					{ type: String, optional: true, },
	isShipped:				{ type: String, optional: true, },
	deliveryDate: {
		type: String, optional: true,
		autoform: { label: 'Delivery Date(s)'},
	},
	deliveryDateChecked:	{ type: Date, optional: true, },
	customerEmail: {
		type: String, optional: true, regEx: SimpleSchema.RegEx.Email,
		autoform: { type: "email", label: 'Email', class: 'uk-form-width-large'},
  	},
	customerPhone: { 
		type: String, optional: true, 
		autoform: { type: 'tel', label: 'Phone'},
	},
	deliveryTo: {
		type: String, optional: true,
		autoform: { label: 'A Posy For', },
  	},
	specialMessage:	{
		type: String, optional: true, 
		autoform: { rows: 2, class: 'uk-form-width-large'},
  	},
	deliveryFrom: {
		type: String, optional: true,
		autoform: { label: "From", },
  	},
	shipInstructions: {
		type: String, optional: true, 
		autoform: { rows: 2, class: 'uk-form-width-large'},
  	},
	deliveryName: {
		type: String, optional: true,
		autoform: { label: 'Name', },
  	},
	deliveryBusiness: {
		type: String, optional: true,
		autoform: { label: 'Business / Unit / Level / Suite', },
  	},
	deliveryAddress: {
		type: String, optional: true,
		autoform: { rows: 2, label: 'Address', class: 'uk-form-width-large'},
  	},
	shipAddress:			{ type: Array, optional: true, },
	'shipAddress.$':		{ type: String },
	shipLocation:			{ type: shipLocationSpec, optional: true, },
	productCode:			{ type: String, optional: true, },

	isSelected:				{ type: String, optional: true, },
	driver:					{ type: String, optional: true, },
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

