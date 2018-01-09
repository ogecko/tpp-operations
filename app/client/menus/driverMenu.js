import { Template } from 'meteor/templating';
import { drivers } from '/imports/api/drivers';

Template.driverMenu.onCreated(function helloOnCreated() {
	// counter starts at 0
});


Template.driverMenu.helpers({
	drivers: () => drivers.driverCollection, 
});

Template.driverMenu.events({
	'click .js-refresh'(event, instance) {
		// action
	},
});

