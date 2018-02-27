import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import lunrIndex from '/imports/api/lunrIndex';

// Find any selectors with a $lunr operator and expand them to actual references
// Use the mutate function when you have a collection with non-string ref
// eg expandLunr('orders', selector, x=>ParseInt(x, 10))
// 
// To use this function you should use call it from two places in your app
//     in the Meteor.publish function on the server, where it replaces $lunr with actual references to publish
//     in the Template.helper function on the client, where it ignores the $lunr operation
// You will also need to add a field definition to be used by select.getSelectorFromParams
//     	{ param: 'q', field: 'title', operator: '$lunr' },
// Note that this function should not be called
//     in the Template.onCreated function on the client, where it passes the selector to the subscribe
//     we want to leave the selector unexpanded in the subscribe call, and only expand it on the server
//     
export function _expandLunr(name, selector, mutate=_.identity) {
	_.each(selector, (value, key) => {
		if (value.$lunr) {
			if (Meteor.isClient)
				delete selector[key];
			else
				selector[key] = { $eq: mutate(value.$lunr) };
				// selector[key] = { $in: _.map(lunrIndex.search(name, value.$lunr), x => mutate(x.ref)) };
		}
	});
	return selector;
}

