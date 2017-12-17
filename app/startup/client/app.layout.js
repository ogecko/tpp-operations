import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { isSignedIn } from '/imports/lib/isSignedIn.js';

Template.appLayout.helpers({
	isSignedIn: () => isSignedIn(),
});
