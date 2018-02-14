import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import lunr from 'lunr';
import { _ } from 'meteor/underscore';
import { lunrStore } from './lunr.store.js';


export function init(options) {		// executed on server only
	const fieldDefn = new SimpleSchema({
		key:		{ type: String },
		ref:		{ type: Boolean, optional:true },
		boost: 		{ type: Number, optional:true },
		mutate: 	{ type: Function, optional:true },	// function that takes doc field and returns mutated doc field to index
	});
	const allowedOptions = new SimpleSchema({
		name:		{ type: String },					// name of this index
		collection:	{ type: Object, blackbox: true  },					// collection to index over
		fields:		{ type: Array, minCount: 1 },		// definition of fields to index
		'fields.$':	{ type: fieldDefn },				// definition of fields to index
	});

	allowedOptions.validate({ ...options });

	if (Meteor.isServer) {
		console.log('Initializing lunrIndex '+options.name);
		lunrStore[options.name] = lunr(function () {
			// add fields to the index
			const self = this;
			_.each(options.fields, function (f) {
				if (f.ref) self.ref(f.key);
				if (f.boost) self.field(f.key, { 'boost': f.boost });
				if (!f.boost) self.field(f.key);
			});
			// add documents to the index
			const findFields = _.reduce(options.fields, (m, f) => { m[f.key] = 1; return m } , {});
			const mutateFields = _.reduce(options.fields, (m, f) => { if (f.mutate) m[f.key] = f.mutate; return m } , {});
			const mutateFn = (doc) => {
				_.each(mutateFields, function (mutate, key) { if (doc[key]) doc[key] = mutate(doc[key])});
				return doc;
			};
			console.log (JSON.stringify(findFields,2));
			options.collection.find({}, { fields: findFields }).observeChanges({
				added(id, doc) { self.add(mutateFn(doc)); },
				changed(id, doc) { self.update(mutateFn(doc)); },
				// removed(id, doc) { lunrStore[options.name].remove(doc); },	// doc is not passed on removes
			});
		});

		return lunrStore[options.name];
	}
	return undefined;
}