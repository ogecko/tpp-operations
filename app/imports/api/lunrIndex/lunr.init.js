import { Meteor } from 'meteor/meteor';
import { Collection } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import lunr from 'lunr';
import { _ } from 'meteor/underscore';
import { lunrStore } from './lunr.store.js';


export function init(options) {		// executed on server only
	const fieldDefn = new SimpleSchema({
		key:		{ type: String },
		ref:		{ type: Boolean, optional:true },
		boost: 		{ type: Number, optional:true },
	});
	const allowedOptions = new SimpleSchema({
		name:		{ type: String },					// name of this index
		collection:	{ type: Collection  },				// collection to index over
		fields:		{ type: [fieldDefn], minCount: 1 },	// definition of fields to index
	});
	allowedOptions.validate({ ...options });

	if (Meteor.isServer) {
		console.log('Initializing lunrIndex '+options.name);
		lunrStore[options.name] = lunr(function () {
			_.each(options.fields, function (f) {
				if (f.ref) this.ref(f.key);
				if (f.boost) this.field(f.key, { 'boost': f.boost });
				if (!f.boost) this.field(f.key);
			}, this);
		});

		findFields = _.reduce(options.fields, (m, f) => { m[f.key] = 1; return m } , {});
		console.log (JSON.stringify(findFields,2));
		options.collection.find({}, { fields: findFields }).observeChanges({
			added(id, doc) { lunrStore[options.name].add(doc); },
			changed(id, doc) { lunrStore[options.name].update(doc); },
			// removed(id, doc) { lunrStore[options.name].remove(doc); },	// doc is not passed on removes
		});
		return lunrStore[options.name];
	}
	return undefined;
}