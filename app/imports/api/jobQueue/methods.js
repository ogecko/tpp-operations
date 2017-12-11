import { Meteor } from 'meteor/meteor';
import { jobQueueCollection } from './model.js';
import { dispatch } from './dispatch.js';


Meteor.methods({
	cleanJobs: () => jobQueueCollection.remove({ }),
	dispatch: (...args) => (Meteor.isServer && dispatch(...args)),				// only execute this on the server
})
