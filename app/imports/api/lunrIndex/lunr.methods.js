import { Meteor } from 'meteor/meteor';
import { Mongo, Cursor } from 'meteor/mongo';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import lunr from 'lunr';
import { _ } from 'meteor/underscore';
import { lunrStore } from './lunr.store.js';

Meteor.methods({
	'lunrIndex.search': (name, query) => {		// called from server or client AND executed on server
		if (Meteor.isServer && name && query && lunrStore[name]) {
			check(name, String);
			check(query, String);
			const results = lunrStore[name].search(query);
			return _.first(results, 10);
		}
		return [];
	},
	'lunrIndex.test': (name, query) => {		// called from server or client AND executed on server
		if (Meteor.isServer && name && query && lunrStore[name]) {
			check(name, String);
			check(query, String);
			const idx = lunrStore[name];
			const tokens = idx.pipeline.run(idx.tokenizerFn(query));
			const goodTokens = _.filter(tokens, token => idx.tokenStore.has(token));
			const results = idx.search(goodTokens.join(' '));
			return results;
		}
		return [];
	},
	'lunrIndex.idf': (name, terms) => {		// called from server or client AND executed on server only
		if (Meteor.isServer && name && terms && lunrStore[name]) {
			check(name, String);
			check(terms, String);
			const idx = lunrStore[name];
			const tokens = idx.pipeline.run(idx.tokenizerFn(terms));
			return _.sortBy(tokens, token => (idx.tokenStore.has(token) ? -idx.idf(token) : -Infinity));
		}
		return [];
	},

});
