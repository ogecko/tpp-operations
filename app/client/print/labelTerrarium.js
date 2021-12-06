import { FlowRouter } from 'meteor/kadira:flow-router';

Template.labelTerrarium.onRendered(function() {
	Meteor.setTimeout(() => { 
		window.print(); 
		window.close() 
	}, 1000);
});

Template.labelTerrarium.helpers({
	labels: function() {
		const num = parseInt(FlowRouter.getQueryParam('num') || '18');
		return Array(num).fill(1)
	},
	date: d => d,
});


