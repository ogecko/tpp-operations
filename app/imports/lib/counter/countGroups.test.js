/* eslint-env mocha */
import { chai, expect } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:factory';
import Faker from 'faker';
import { _ } from 'meteor/underscore';
import { countGroups } from '/imports/api/counter/countGroups.js';

function factoryCreateTestDB() {
	if (Meteor.isServer) {
		const db = new Mongo.Collection('countGroups');
		Factory.define('record', db, {
			itemId: () => Faker.random.uuid(),
			itemName: () => Faker.commerce.productName(),
			color: () => Faker.commerce.color(),
			department: () => Faker.commerce.department(),
			country: () => Faker.address.country(),
			city: () => Faker.address.city(),
			month: () => Faker.date.month(),
			currency: () => Faker.finance.currencyCode(),
			suppliers: () => {
				const arr = [];
				_.times(_.random(1, 3), () => arr.push({ name: Faker.company.companyName() }));
				return arr;
			},
		});
		db.remove({});
		_.times(100, () => Factory.create('record'));
		_.times(30, () => Factory.create('record', { city: 'Sydney' }));
		_.times(60, () => Factory.create('record', { city: 'Melbourne' }));
		return db;
	}
}

// This is performed once per server restart
const collection = factoryCreateTestDB();

if (Meteor.isServer) {
	describe('api/counter countGroups tests', () => {
		it('should pass a test', () => {
			true.should.equal(true);
		});

		it('should handle a simple count', () => {
			const match = {};
			const results = countGroups(collection, match);
			JSON.stringify(results, 2).should.equal('{"count":190,"groups":[]}');
		});

		it('should count all documents grouped by a simple field', () => {
			const match = {};
			const defns = [{ label: 'Month', param: 'month' }];
			const results = countGroups(collection, match, defns);
			results.count.should.equal(190);
			results.groups.length.should.equal(1);
			JSON.stringify(results.groups[0], 2).should.match(/\{"label":"Month","param":"month","items":.*\}/);
			JSON.stringify(results.groups[0].items, 2).should.match(/\[(\{"label":"[JFMASOND].*","value":"[JFMASOND].*","count":[0-9]+\},?)+\]/);
		});

		it('should count filtered documents and handle non-existant groupBy field', () => {
			const match = { city: 'Sydney' };
			const defns = [{ label: 'Junk', param: 'junk' }];
			const results = countGroups(collection, match, defns);
			JSON.stringify(results, 2).should.equal('{"count":30,"groups":[]}');
		});

		it('should count multiple filtered documents and handle non-existant groupBy field', () => {
			const match = { city: { $in: ['Melbourne', 'Sydney'] } };
			const defns = [{ label: 'Junk', param: 'junk' }];
			const results = countGroups(collection, match, defns);
			JSON.stringify(results, 2).should.equal('{"count":90,"groups":[]}');
		});

		it('should count multiple filtered documents and group by a simple field', () => {
			const match = { city: { $in: ['Melbourne', 'Sydney'] } };
			const defns = [{ label: 'Month', param: 'month' }];
			const results = countGroups(collection, match, defns);
			const total = _.reduce(results.groups[0].items, (m, x) => m + x.count, 0);
			results.groups[0].items.length.should.be.above(1);
			total.should.equal(90);
		});

		it('should count multiple filtered documents ignoring the group in question', () => {
			const match = {
				city: { $in: ['Melbourne', 'Sydney'] },
				month: { $in: ['January', 'February'] },  // dont filter by month as we want its breakdown
			};
			const defns = [{ label: 'Month', param: 'month' }];
			const results = countGroups(collection, match, defns);
			const total = _.reduce(results.groups[0].items, (m, x) => m + x.count, 0);
			results.groups[0].items.length.should.be.above(1);
			total.should.equal(90);
		});

		it('should unwind arrays of objects to count occurrences of their subfield values', () => {
			const match = {};
			const defns = [{ label: 'Supplier', param: 'supplier', field: 'suppliers.name' }];
			const results = countGroups(collection, match, defns);
			const total = _.reduce(results.groups[0].items, (m, x) => m + x.count, 0);
			results.groups[0].items.length.should.be.above(1);
			total.should.be.above(190);
		});

		it('should count documents across multiple groups and the total', () => {
			const match = {};
			const defns = [
				{ label: 'Month', param: 'month' },
				{ label: 'Color', param: 'color' },
				{ label: 'Department', param: 'department' },
			];
			const results = countGroups(collection, match, defns);
			results.count.should.equal(190);
			results.groups.length.should.equal(3);
			const deptTotal = _.reduce(results.groups[2].items, (m, x) => m + x.count, 0);
			deptTotal.should.equal(190);
		});

		it('should count documents across multiple groups and limit max items in a group', () => {
			const match = {};
			const defns = [
				{ label: 'Month', param: 'month' },
				{ label: 'Color', param: 'color' },
				{ label: 'Department', param: 'department', limit: 4 },
			];
			const results = countGroups(collection, match, defns);
			results.count.should.equal(190);
			results.groups.length.should.equal(3);
			results.groups[2].items.length.should.equal(4 + 1);
			const deptTotal = _.reduce(results.groups[2].items, (m, x) => m + x.count, 0);
			deptTotal.should.equal(190);
		});

	});
}
