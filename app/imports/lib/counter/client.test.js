/* eslint-env mocha */
import { chai, expect } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { Meteor } from 'meteor/meteor';
// import { Random } from 'meteor/random';
// import { DDP } from 'meteor/ddp-client';
// import { Mongo } from 'meteor/mongo';
// import { stubs }	from 'meteor/practicalmeteor:sinon';
// import { Factory } from 'meteor/dburles:factory';
// import { _ } from 'meteor/underscore';
import { Counter } from '/imports/api/counter/client.js';

if (Meteor.isClient) {
	describe('api/counter Client tests', () => {
		it('should pass a test', () => {
			true.should.equal(true);
		});

		it('should return the count of documents', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 20 });
			Counter.get('sample').should.equal(20);
		});

		it('should return 1 page of 6 per page over 0 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 0 });
			Counter.pages('sample', 6).should.equal(1);
		});

		it('should return 1 page of 6 per page over 1 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 1 });
			Counter.pages('sample', 6).should.equal(1);
		});

		it('should return 1 page of 6 per page over 6 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 6 });
			Counter.pages('sample', 6).should.equal(1);
		});

		it('should return 2 pages of 6 per page over 7 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 7 });
			Counter.pages('sample', 6).should.equal(2);
		});

		it('should return 4 pages of 6 per page over 23 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 23 });
			Counter.pages('sample', 6).should.equal(4);
		});

		it('should return 4 pages of 6 per page over 24 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 24 });
			Counter.pages('sample', 6).should.equal(4);
		});

		it('should return 5 pages of 6 per page over 25 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 25 });
			Counter.pages('sample', 6).should.equal(5);
		});

		it('should return 4 pages of 25 per page over 100 docs', () => {
			Counter.collection.upsert({ _id: 'sample' }, { _id: 'sample', count: 100 });
			Counter.pages('sample', 25).should.equal(4);
		});

	});
}
