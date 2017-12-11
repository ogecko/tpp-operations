import { jobQueueCollection } from './model.js';

export function dispatch(action, data, options={}) {
		const job = new Job(jobQueueCollection, action, data).priority('normal');

		// Set optional Job Priority eg. { priority: 'high' }
		if (options.priority)
			job.priority(options.priority);

		// Set optional Job Retries eg. { retries: 3, wait: 10*1000 } ie 10 sec before retries
		if (options.retries && options.wait) {
			job.retry({ retries: options.retries, wait: options.wait })		
		}

		// Set optional Job Schedule eg. { schedule: "every 5 minutes" }
		if (options.schedule) {
			job.repeat({ schedule: jobQueueCollection.later.parse.text(options.schedule) });
			job.save({ cancelRepeats: true });
		}

		// Save the job
		job.save();

}

