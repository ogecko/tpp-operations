import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { jobQueue } from '/imports/api/jobQueue';
import { UIKit } from 'uikit/dist/js/uikit.min.js';
import { isSignedIn } from '/imports/lib/isSignedIn.js';

Template.navBar.onRendered(() => {

});

Template.navBar.helpers({
	isSignedIn: () => isSignedIn(),
	isNotSignedIn: () => !isSignedIn(),
});

Template.navBar.events({
	'click .js-refresh'(event, instance) {
		// action
	},
});

