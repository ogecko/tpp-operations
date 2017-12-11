/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { chai, expect } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { stubs }	from 'meteor/practicalmeteor:sinon';
import { Factory } from 'meteor/dburles:factory';
import { _ } from 'meteor/underscore';
import lunrIndex from '/imports/api/lunrIndex';
import { books } from './lunr.test.data.js';

if (Meteor.isServer) {

	// create a test database and index it
	let indexDefn = {};
	const bookCollection = new Mongo.Collection('books'); 
	const validIndexDefn = {
				name: 'book',
				collection: bookCollection,
				fields: [
					{ key: 'title', ref: true },
					{ key: 'author' },
				],
			};
	bookCollection.remove({});
	books.forEach(b => bookCollection.insert(b) );
	lunrIndex.init(validIndexDefn);

	describe('api/lunrIndex Server tests', () => {
		beforeEach(() => {
			indexDefn = { ...validIndexDefn };
		});

		it('should check for invalid name on initialisation', () => {
			indexDefn.name = 100;
			expect(() => lunrIndex.init(indexDefn))
				.to.throw('Name must be a string [validation-error]');
		});

		it('should check for invalid collection on initialisation', () => {
			indexDefn.collection = undefined;
			expect(() => lunrIndex.init(indexDefn))
				.to.throw('Collection is required [validation-error]');
		});

		it('should check for at least 1 field definition on initialisation', () => {
			indexDefn.fields = [];
			expect(() => lunrIndex.init(indexDefn))
				.to.throw('You must specify at least 1 values [validation-error]');
		});

		it('should allow initialisation and search of an index', () => {
			lunrIndex.init(indexDefn);
			lunrIndex.search('book', 'dan').length.should.equal(3);
		});
	});
}

if (Meteor.isClient)
	describe('api/lunrIndex Client tests', () => {
		it('should check to prevent intialisation from client', () => {
			expect(lunrIndex.init).to.not.exist;
		});
		it('should allow search of an index from a client', (done) => {
			lunrIndex.search('book', 'dan', function(err, res) {
				res.should.deep.equal([
					{"ref":"The DaVinci Code","score":0.4411139462796189},
					{"ref":"Angels & Demons","score":0.4185323328840654},
					{"ref":"The Lost Symbol","score":0.4185323328840654},
				]);
				done();
			})
		});
	});

