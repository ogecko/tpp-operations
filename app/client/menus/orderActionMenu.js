import { Template } from 'meteor/templating';
import UIkit from 'uikit';

Template.orderActionMenu.events({
	'click .js-clear-all': (event, instance) => Meteor.call('select none'), 

	'click .js-select-all': (event, instance) => Meteor.call('select all'), 

	'click .js-select-todays': (event, instance) => Meteor.call('select todays'), 

	'click .js-toggle-ship-modal': (event, instance) => UIkit.modal('#ship-modal').show(),

	'click .js-toggle-date-modal': (event, instance) => UIkit.modal('#date-modal').show(),

});

