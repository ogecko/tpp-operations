import { Meteor } from 'meteor/meteor';
import { fetch } from '/imports/fetch';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';
import SimpleSchema from 'simpl-schema';

Meteor.startup(() => {
	if (Meteor.isServer) {
		// code to run on server at startup
	}

});

