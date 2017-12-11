import { Meteor } from 'meteor/meteor';
import { jobQueueCollection } from './model.js';
import { recruitWorker } from './recruitWorker.js';
import { methods } from './methods.js';

export function startup() {
	if (Meteor.isServer) {

		// Grant full permission to any  user
		jobQueueCollection.allow({
			admin: function (userId, method, params) {
				return (userId ? true : true);
			}
		});	

	  	// start the job server
		jobQueueCollection.startJobServer();

		Meteor.publish('jobQueue', function () {
			return jobQueueCollection.find({});	
		});

		// // create a job to clean old entries
		// new Job(jobQueueCollection, 'cleanup', {})
		// .repeat({ schedule: jobQueueCollection.later.parse.text("every 5 minutes") })
		// .save({ cancelRepeats: true })

		// // recruit the cleaner to remove all the old jobs and give them a job description
		// recruitWorker('cleanup', { pollInterval: false, workTimeout: 60*1000 }, (job) => {
		// 	let current = new Date();
		// 	current.setMinutes(current.getMinutes() - 5);
		// 	const ids = jobQueueCollection.find({
		// 		status: { $in: Job.jobStatusRemovable },
		// 		updated: { $lt: current  },
		// 	}, {
		// 		fields: { _id: 1 }
		// 	}).map(d => d._id);

		// 	if (ids.length > 0) {
		// 		jobQueueCollection.removeJobs(ids);
		// 		console.log(`Removed ${ids.length} old jobs`);
		// 	}
		// 	job.done(`Removed ${ids.length} old jobs`);			
		// });
	}	
}
