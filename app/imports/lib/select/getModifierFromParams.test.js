/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { stubs }	from 'meteor/practicalmeteor:sinon';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { select } from '/imports/lib/select';

if (Meteor.isClient) {
	describe('lib/select getModifierFromParams.js tests', () => {
		afterEach(() => {
			stubs.restoreAll();
		});

		it('should pass a test', () => {
			true.should.equal(true);
		});

		it('should create modifer with defaults', () => {
			const result = select.getModifierFromParams();
			JSON.stringify(result).should.equal('{"limit":30,"skip":0,"sort":{"orderNo":-1}}');
		});

		it('should create modifer with correct skip', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('p').returns('3');
			const result = select.getModifierFromParams();
			JSON.stringify(result).should.equal('{"limit":30,"skip":60,"sort":{"orderNo":-1}}');
		});

		it('should create modifer with correct skip for 50 items per page', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('p').returns('5')
				.withArgs('pp').returns('50');
			const result = select.getModifierFromParams();
			JSON.stringify(result).should.equal('{"limit":50,"skip":200,"sort":{"orderNo":-1}}');
		});

		it('should create modifier with correct skip and sort', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('p').returns('5')
				.withArgs('pp').returns('50')
				.withArgs('s').returns('variety');
			const result = select.getModifierFromParams();
			JSON.stringify(result).should.equal('{"limit":50,"skip":200,"sort":{"variety":1}}');
		});

		it('should create modifier with correct skip and descending sort', () => {
			stubs.create('flow', FlowRouter, 'getQueryParam')
				.withArgs('p').returns('5')
				.withArgs('pp').returns('50')
				.withArgs('s').returns('region:des');
			const result = select.getModifierFromParams();
			JSON.stringify(result).should.equal('{"limit":50,"skip":200,"sort":{"region":-1}}');
		});
	});
}
