/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { stubs }	from 'meteor/practicalmeteor:sinon';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { select } from '/imports/lib/select';

if (Meteor.isClient) {
	describe('lib/select getSelectorFromParams.js tests', () => {
		afterEach(() => {
			stubs.restoreAll();
		});

		it('should pass a test', () => {
			true.should.equal(true);
		});

		it('should create selector with simple $eq', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('variety').returns('shiraz');
			const result = select.getSelectorFromParams([{ param: 'variety', operator: '$eq' }]);
			JSON.stringify(result).should.equal('{"variety":{"$eq":"shiraz"}}');
		});

		it('should create selector with a field different than the parameter', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('supplier').returns('DanMurphy');
			const result = select.getSelectorFromParams([{ param: 'supplier', field: 'suppliers.name', operator: '$eq' }]);
			JSON.stringify(result).should.equal('{"suppliers.name":{"$eq":"DanMurphy"}}');
		});

		it('should create selector ignoring undefined URL query parameters', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('variety').returns('shiraz');
			const result = select.getSelectorFromParams([
				{ param: 'variety', operator: '$eq' },
				{ param: 'region', operator: '$in' },
			]);
			JSON.stringify(result).should.equal('{"variety":{"$eq":"shiraz"}}');
		});

		it('should create selector with multiple matches $in', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('vintage').returns('2015|2016');
			const result = select.getSelectorFromParams([{ param: 'vintage', operator: '$in' }]);
			JSON.stringify(result).should.equal('{"vintage":{"$in":["2015","2016"]}}');
		});

		it('should create selector with a regular expression $regex', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('title').returns('Barwang');
			const result = select.getSelectorFromParams([{ param: 'title', operator: '$regex' }]);
			JSON.stringify(result).should.equal('{"title":{"$regex":"Barwang","$options":"i"}}');
		});

		it('should create selector with multiple fields', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('variety').returns('shiraz')
				.withArgs('vintage').returns('2015|2016')
				.withArgs('title').returns('Barwang');
			const result = select.getSelectorFromParams([
				{ param: 'variety', operator: '$eq' },
				{ param: 'vintage', operator: '$in' },
				{ param: 'title', operator: '$regex' },
			]);
			JSON.stringify(result).should.equal('{"variety":{"$eq":"shiraz"},"vintage":{"$in":["2015","2016"]},"title":{"$regex":"Barwang","$options":"i"}}');
		});
	});
}

