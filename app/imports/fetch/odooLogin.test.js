/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { odooLogin }	from './odooLogin.js';

if (Meteor.isServer) {

    // Simple unit tests for combine.js library function
    describe('fetch/odooLogin.js Unit tests', () => {
        it('should pass a test', () => {
            true.should.equal(true);
        });

        it('should sucessfully authenticate ', () => {
            const result = odooLogin(
                Meteor.settings.odooServer,
                Meteor.settings.odooDb,
                Meteor.settings.odooUser,
                Meteor.settings.odooPassword,
            );
            result.should.have.property('session_id');
        });

        it('should return error when trying to logon to a Meter app ', () => {
            const result = odooLogin('https://tpp.ogecko.com', 'junk', 'junk', 'junk');
            JSON.stringify(result).should.equal('{"error":{"message":"no data returned","code":-1}}');
        });

        it('should return error when invalid db', () => {
            const result = odooLogin(Meteor.settings.odooServer, 'junk', 'junk', 'junk');
            JSON.stringify(result).should.equal('{"error":{"message":"FATAL:  database \\"junk\\" does not exist\\n","code":-2}}');
        });

        it('should return error when invalid username', () => {
            const result = odooLogin(Meteor.settings.odooServer, Meteor.settings.odooDb, 'junk', 'junk');
            JSON.stringify(result).should.equal('{"error":{"message":"Expected singleton: res.users()","code":-2}}');
        });

        it('should return error when invalid password', () => {
            const result = odooLogin(Meteor.settings.odooServer, Meteor.settings.odooDb, Meteor.settings.odooUser, 'junk');
            JSON.stringify(result).should.equal('{"error":{"message":"Expected singleton: res.users()","code":-2}}');
        });

    });


}
