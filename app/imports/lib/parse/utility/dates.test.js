/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { _ } from 'meteor/underscore';
import { chai } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import moment from 'moment';
import { parse } from '/imports/lib/parse';
import { data } from './dates.test.data.js';

function testDates(id, s) {
	const result = parse.dates(s);
	_.isDate(result).should.equal(true);
	return id+':'+moment(result).format('YYYY-MM-DD');
}


describe('lib/parse/dates tests', function () {

	it('should pass a test', () => {
		true.should.equal(true);
	});


	it('should parse a simple date', () => {
		testDates('A','1/1/2018').should.equal('A:2018-01-01');
	});

	it('should handle undefined', () => {
		testDates('B',undefined).should.equal('B:'+moment().format('YYYY-MM-DD'));
	});

	it('should handle a Date rather than string', () => {
		testDates('C',new Date()).should.equal('C:'+moment().format('YYYY-MM-DD'));
	});

	it('should ensure dates are at midnight UTC time', () => {
		const result = parse.dates('10/1/18');
		result.getUTCHours().should.equal(0);
		result.getUTCMinutes().should.equal(0);
	});

	data.forEach(d => {
		it('should parse real order '+d.order, () => {
			testDates(d.order, d.delivery).should.equal(d.order+':'+d.expected);
		});

	})
});
