import { Meteor } from 'meteor/meteor';
import { jobQueueCollection } from './model.js';

// called by someone who defined a job position (action) and job description (process)
export function recruitWorker(action, options, process) {

	if (Meteor.isServer) {
		// create some workers to process the jobs
		const workers = Job.processJobs('jobQueue', action, options,
			function (job, cb) {
				try {
					process(job, cb);
					// cb();
				} catch(e) {
					var exmsg = 'Exception caught in fetch: ';
					if (e.message) exmsg += e.message;
					if (job.data)  exmsg += '\nProcessing job.data = '+JSON.stringify(job.data,true,2);
					if (e.stack)   exmsg += '\nWith Stack: ' + e.stack;
					console.warn(exmsg);
					job.fail('Failed due to Exception');
					cb();
				}
			});

		// responsively wake up the workers if new jobs become ready
		jobQueueCollection.find({ type: action, status: 'ready' }).observe({
			added: function () {  workers.trigger(); }
		});
	}
}