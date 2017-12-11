import { jobQueue } from '/imports/api/jobQueue';

Template.jobList.onCreated(function() {
	const self = this;
	self.autorun(function() {
		self.subscribe('jobQueue');
			// select.getSelectorFromParams(jobQueue.filterFields),
			// select.getModifierFromParams(),
	});
});

Template.jobList.helpers({
	jobQueue: () => jobQueue.jobQueueCollection.find({ }, { sort: [['type', 'asc']] }),
	numTotalJobs: () => (jobQueue.jobQueueCollection.find({ type: { $ne : 'cleanup' } }).count()),
	numRunningJobs: () => (jobQueue.jobQueueCollection.find({ 
		type: { $ne : 'cleanup' }, 
		status: { $in: [ 'running', 'ready', 'waiting', 'paused' ]}
	}).count()),
	isRepeats: (job) => ((job.repeats>0) ? 'R' : undefined),
	show: (numRunningJobs) => ((numRunningJobs > 0) ? undefined : 'uk-invisible'),
	diff: (a, b) => (a - b),
	bkrStatus: (job) => bkrStatus[job.status],
});

const bkrStatus = {
	created: 'uk-background-default',
	waiting: 'uk-background-muted',
	ready: 'uk-background-muted',
	running: 'uk-background-primary uk-light',
	completed: 'uk-background-default',
	cancelled: 'uk-background-default',
	paused: 'uk-background-default',
}
Template.jobList.events({
	'click .js-clear'(event, instance) {
		Meteor.call('cleanJobs');
	},
	'click .js-fetch'(event, instance) {
		Meteor.call('fetch list');
	},
});
