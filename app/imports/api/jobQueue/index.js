import { jobQueueCollection } from './model.js';
import { startup } from './startup.js';
import { recruitWorker } from './recruitWorker.js';
import { recruitCleaner } from './recruitCleaner.js';

startup();

export const jobQueue = { 
	recruitWorker, 
	recruitCleaner, 
	jobQueueCollection ,
	dispatch: (...args) => Meteor.call('dispatch', ...args),		// always execute this on the server
};