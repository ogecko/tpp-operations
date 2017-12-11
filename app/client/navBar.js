import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { jobQueue } from '/imports/api/jobQueue';
import { UIKit } from 'uikit/dist/js/uikit.min.js';

Template.navBar.onRendered(() => {

});

function isSignedIn() {
	const user = Meteor.user();
	if (user) {
		const email = user.emails[0].address;
		if (email === 'jdmorriso@gmail.com' || 
			email === 'contactus@theposyplace.com.au') {
			return true;
		}
	}
	return undefined;
} 

Template.navBar.helpers({
	isSignedIn: () => isSignedIn(),
	isNotSignedIn: () => !isSignedIn(),
});

Template.navBar.events({
	'click .js-refresh'(event, instance) {
		// increment the counter when button is clicked
		jobQueue.dispatch('fetch list', { }, { retries: 3, wait: 10*1000 });
	},
});

