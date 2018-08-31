/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { odooFetchOrders }	from './odooFetchOrders.js';


// Simple unit tests for combine.js library function
describe('fetch/odooFetchOrders.js Unit tests', () => {
	it('should pass a test', () => {
		true.should.equal(true);
    });
    
	it('should sucessfully fetch orders ', () => {
        const result = odooFetchOrders(Meteor.settings.odooServer)
        JSON.stringify(result).should.equal('{"error":{"message":"no data returned","code":-1}}');
    });


});