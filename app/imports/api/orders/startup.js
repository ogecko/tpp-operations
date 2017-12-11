import { Meteor } from 'meteor/meteor';
import { Counter } from '/imports/lib/counter/server.js';
import { _ } from 'meteor/underscore';
import { orderCollection } from './model.js';
import { orderFilterFields } from './model.js';
import { methods } from './methods.js';
import { select } from '/imports/lib/select';

function signedIn() {
	const user = Meteor.user();
	if (user) {
		const email = user.emails[0].address;
		console.log(email);
		if (email === 'jdmorriso@gmail.com' || 
			email === 'contactus@theposyplace.com.au') {
			return true;
		}
	}
	return undefined;
}


export function startup() {
	if (Meteor.isServer) {
		Meteor.publish('orders', function (orderSelector, modifier) {
			if (signedIn()) {
				console.log('orders-sel ',JSON.stringify(orderSelector));
				console.log('orders-mod ',JSON.stringify(modifier));

				select.validateParams(orderFilterFields, orderSelector, modifier);

				// Publish the list of wines
				const cursors = [];
				cursors.push(orderCollection.find(orderSelector, modifier));
				cursors.push(new Counter('wc', orderCollection, orderSelector, orderFilterFields));

				return cursors;
			}
		}); 
	}
}
