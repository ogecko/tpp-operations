import { Meteor } from 'meteor/meteor';
import { countGroups } from './countGroups.js';

// Class that creates a Cursor that can be returned from a publication
export const Counter = class {
	constructor(name, collection, match, defns, interval) {
		this.name = name;
		this.collection = collection;
		this.match = match || {};
		this.defns = defns || [];
		this.interval = interval || 1000 * 10;
		this.cursor = collection.find(this.match);
		this._collectionName = 'counters-collection';
	}

	// every cursor must provide a collection name via this method
	_getCollectionName() {
		return `counter-${this.name}`;
	}

	// the api to publish
	_publishCursor(sub) {
		const self = this;
		const groups = countGroups(self.collection, self.match, self.defns);
		// sub.added(self._collectionName, self.name, { count: count1 });
		sub.added(self._collectionName, self.name, groups);
		sub.ready();

		const handler = Meteor.setInterval(() => {
			groups.count = self.collection.find(self.match).count();
			sub.changed(self._collectionName, self.name, groups);
		}, self.interval);

		sub.onStop(() => {
			Meteor.clearTimeout(handler);
		});
	}
};
