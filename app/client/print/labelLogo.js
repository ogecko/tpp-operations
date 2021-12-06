import { FlowRouter } from 'meteor/kadira:flow-router';

Template.labelLogo.onRendered(function() {
	Meteor.setTimeout(() => { 
		window.print(); 
		window.close() 
	}, 1000);
});

Template.labelLogo.helpers({
	labels: function() {
		const num = parseInt(FlowRouter.getQueryParam('num') || '18');
		return Array(num).fill(1)
	},
	logo: function() {
		const logosrc = '/' + (FlowRouter.getQueryParam('logo') || 'logoUltrasoundCareV.png');
		return logosrc
	},
	date: d => d,
});


