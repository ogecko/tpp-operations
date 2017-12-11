/* eslint-env mocha */
import { chai, expect } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
// import { Mongo } from 'meteor/mongo';
// import { stubs }	from 'meteor/practicalmeteor:sinon';
// import { Factory } from 'meteor/dburles:factory';
// import { _ } from 'meteor/underscore';
import { Counter } from '/imports/api/counter/server.js';
import { createClient } from '/imports/test/server.test-helpers.js';

function initialiseDB() {
	const db = {
		pubName: Random.id(),
		collName: Random.id(),
	};
	db.coll = new Meteor.Collection(db.collName);
	db.coll.insert({ aa: 10 });
	db.coll.insert({ aa: 20 });
	db.cleanup = (done) => { db.coll.rawCollection().drop(); done(); };
	return db;
}

if (Meteor.isServer) {
	describe('api/counter Server tests', () => {
		it('should pass a test', () => {
			true.should.equal(true);
		});

		it('should be able to publish the counts of a single cursor', (done) => {
			const db = initialiseDB();
			Meteor.publish(db.pubName, () => new Counter('simple', db.coll));

			const client = createClient();
			client._livedata_data = (msg) => {
				if (msg.collection === 'counters-collection' &&
					msg.id === 'simple' && msg.msg === 'added' ) {
					msg.fields.count.should.equal(2);
					client.disconnect();
					db.cleanup(done);
				}
			};
			client.subscribe(db.pubName);
		});

		it('should be able to publish multiple counts', (done) => {
			const db = initialiseDB();
			Meteor.publish(db.pubName, () => ([
				new Counter('simple', db.coll),
				new Counter('simple2', db.coll, { aa: 20 }),
			]));

			const client = createClient();
			client._livedata_data = (msg) => {
				if (msg.collection === 'counters-collection' &&
					msg.id === 'simple2' && msg.msg === 'added' ) {
					msg.fields.count.should.equal(1);
					client.disconnect();
					db.cleanup(done);
				}
			};
			client.subscribe(db.pubName);
		});

		it('should be able to publish changing counts', (done) => {
			const db = initialiseDB();
			Meteor.publish(db.pubName, () => new Counter('simple', db.coll, {}, [], 50));

			const client = createClient();
			client._livedata_data = (msg) => {
				if (msg.collection === 'counters-collection' &&
					msg.id === 'simple' && msg.msg === 'added' ) {
					msg.fields.count.should.equal(2);
					db.coll.insert({ aa: 30 });
				}
				if (msg.collection === 'counters-collection' &&
					msg.id === 'simple' && msg.msg === 'changed' ) {
					msg.fields.count.should.equal(3);
					client.disconnect();
					db.cleanup(done);
				}
			};
			client.subscribe(db.pubName);
		});
	});
}
