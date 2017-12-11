/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import select from '/imports/api/select';

if (Meteor.isClient) {
	describe('api/select getScopeFromDefn.js tests', () => {

		it('should pass a test', () => {
			true.should.equal(true);
		});

		it('should create a scope string from the defns', () => {
			const result = select.getScopeFromDefns([
				{ label: 'Red Wines', param: 'vreds', limit: 8, operator: '$in' },
				{ label: 'White Wines', param: 'vwhites', limit: 8, operator: '$in' },
				{ label: 'Sparkling', param: 'vsparkling', limit: 8, operator: '$in' },
				{ label: 'Price', param: 'vprice', limit: 8, operator: '$in' },
				{ label: 'Supplier', param: 'supplier', field: 'suppliers.name', operator: '$in' },
				{ label: 'Region', param: 'region', limit: 8, operator: '$in' },
				{ label: 'Vintage', param: 'vintage', limit: 6, sort: { _id: -1 }, operator: '$in' },
				{ param: 'title', operator: '$regex' },
				{ param: 'vstyle', operator: '$in' },
				{ param: 'variety', operator: '$in' },
			]);
			result.should.equal('vreds|vwhites|vsparkling|vprice|supplier|region|vintage');
		});


	});
}