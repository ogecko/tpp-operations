/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { loginOdoo }	from './loginOdoo.js';


// Simple unit tests for combine.js library function
describe('fetch/loginOdoo.js Unit tests', () => {
	it('should pass a test', () => {
		true.should.equal(true);
	});

	it('should sucessfully authenticate ', () => {
        const result = loginOdoo(
            Meteor.settings.odooServer,
            Meteor.settings.odooDb,
            Meteor.settings.odooUser,
            Meteor.settings.odooPassword,
        );
        result.should.have.property('session_id');
	});

    it('should return error when trying to logon to a Meter app ', () => {
        const result = loginOdoo('https://tpp.ogecko.com', 'junk', 'junk', 'junk');
        JSON.stringify(result).should.equal('{"error":{"message":"no data returned","code":-1}}');
	});

    it('should return error when invalid db', () => {
        const result = loginOdoo(Meteor.settings.odooServer, 'junk', 'junk', 'junk');
        JSON.stringify(result).should.equal('{"error":{"message":"FATAL:  database \\"junk\\" does not exist\\n","code":-2}}');
	});

    it('should return error when invalid username', () => {
        const result = loginOdoo(Meteor.settings.odooServer, Meteor.settings.odooDb, 'junk', 'junk');
        JSON.stringify(result).should.equal('{"error":{"message":"Expected singleton: res.users()","code":-2}}');
	});

    it('should return error when invalid password', () => {
        const result = loginOdoo(Meteor.settings.odooServer, Meteor.settings.odooDb, Meteor.settings.odooUser, 'junk');
        JSON.stringify(result).should.equal('{"error":{"message":"Expected singleton: res.users()","code":-2}}');
	});

});