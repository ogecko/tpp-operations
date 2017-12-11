import { Mongo } from 'meteor/mongo';

export const orderCollection = new Mongo.Collection('orders');

export const orderFilterFields = [
	{ label: 'Order Number', param: 'order', field: 'orderNo', limit: 8, operator: '$in' },
	{ label: 'Buyer Name', param: 'name', limit: 8, operator: '$regex' },
	{ label: 'Shipped', param: 'shipped', field: 'isShipped', limit: 8, operator: '$eq' },
	{ label: 'Modified', param: 'modified', field: 'isModified', limit: 8, operator: '$eq' },
	{ label: 'Selected', param: 'selected', field: 'isSelected', limit: 8, operator: '$eq' },
	{ label: 'Special Message', param: 'msg', field: 'specialMessage', limit: 8, operator: '$regex' },
	{ label: 'Paid', param: 'isPaid', limit: 8, operator: '$in' },
	// { param: 'q', field: 'title', operator: '$lunr' },		// used for lunr searches
];
