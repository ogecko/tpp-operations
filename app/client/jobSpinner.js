import { Template } from 'meteor/templating';
import { jobQueue } from '/imports/api/jobQueue';

Template.jobSpinner.onCreated(function() {
	const self = this;
	self.autorun(function() {
		self.subscribe('jobQueue');
	});
});

Template.jobSpinner.helpers({
	numActiveJobs: () => (jobQueue.jobQueueCollection.find({ 
		type: { $eq : Template.instance().data.jobtype }, 
		status: { $in: [ 'running', 'ready', 'waiting', 'paused' ]}
	}).count()),
});

Template.jobSpinner.events({
	'click .js-clear'(event, instance) {
		//Action
	},
});
