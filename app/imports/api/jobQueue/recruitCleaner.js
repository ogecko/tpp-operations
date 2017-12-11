import { Meteor } from 'meteor/meteor';
import { jobQueueCollection } from './model.js';
import { recruitWorker } from './recruitWorker.js';
import { jobQueue } from '/imports/api/jobQueue';

// ensure someone is employed to do any cleanup work and define what they should do
recruitWorker('cleanup', { concurrency: 1 }, cleanupOldJobs);

export function cleanupOldJobs(job, cb) {
	let current = new Date();
	current.setMinutes(current.getMinutes() - 5);

	// get a list of old removable job ids to cleanup
	const ids = jobQueueCollection.find({
		status: { $in: Job.jobStatusRemovable },
		updated: { $lt: current  },
	}, {
		fields: { _id: 1 }
	}).map(d => d._id);

	// remove any ids that have been found
	if (ids.length > 0) {
		jobQueueCollection.removeJobs(ids);
		console.log(`Removed ${ids.length} old jobs`);
	}
	job.done(`Removed ${ids.length} old jobs`);		
	cb();	
}
