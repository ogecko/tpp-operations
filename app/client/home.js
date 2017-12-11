import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { isSignedIn } from '/imports/lib/isSignedIn.js';

Template.home.helpers({
	isSignedIn: () => isSignedIn(),
});
