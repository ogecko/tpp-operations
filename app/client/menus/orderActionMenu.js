import { Template } from 'meteor/templating';
import UIkit from 'uikit';

Template.orderActionMenu.events({
	'click .js-clear-all': (event, instance) => Meteor.call('select none'), 

	'click .js-select-all': (event, instance) => Meteor.call('select all'), 

	'click .js-select-multi': (event, instance) => Meteor.call('select multi'), 

	'click .js-select-todays': (event, instance) => Meteor.call('select todays'), 

	'click .js-toggle-ship-modal': (event, instance) => UIkit.modal('#ship-modal').show(),

	'click .js-toggle-date-modal': (event, instance) => UIkit.modal('#date-modal').show(),

	'click .js-assign-none': (event,instance) => Meteor.call('assign none'),

	'click .js-assign-selected-driver': (event,instance) => {
		const tgt = instance.$(event.currentTarget)[0];
		const driver = tgt.dataset.driver;
		console.log('Assign selected orders to driver ',driver);
		Meteor.call('assign selected', driver);
	},

});

