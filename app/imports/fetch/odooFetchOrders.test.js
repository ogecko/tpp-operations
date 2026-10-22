/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { odooFetchOrders }	from './odooFetchOrders.js';
import { odooLogin }	from './odooLogin.js';

if (Meteor.isServer) {

    // Simple unit tests for combine.js library function
    describe('fetch/odooFetchOrders.js Unit tests', () => {
        it('should pass a test', () => {
            true.should.equal(true);
        });
        
        it('should sucessfully fetch orders ', () => {
            const s = Meteor.settings;
            const login = odooLogin(s.odooServer, s.odooDb, s.odooUser, s.odooPassword);
            const result = odooFetchOrders(s.odooServer, login.session_id)
            JSON.stringify(result.length).should.be.above(0);
        });


    });

}
