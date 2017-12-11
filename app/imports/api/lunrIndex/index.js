import { Meteor } from 'meteor/meteor';
import { init } from './lunr.init.js';
import { lunrStore } from './lunr.store.js';
import { } from './lunr.methods.js';

const service = {
	store: lunrStore,
	init: (...args) => init(...args),
	search: (...args) => Meteor.call('lunrIndex.search', ...args),
	idf: (...args) => Meteor.call('lunrIndex.idf', ...args),
};

// ensure that init cannot be called from a client
if (Meteor.isClient) service.init = undefined;

export default service;
