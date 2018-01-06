	/* eslint-env mocha */
	import { chai }				from 'meteor/practicalmeteor:chai'; chai.should();
	import { getFieldType }			from './getFieldType.js';

	// Simple unit tests for parse-with-schema getFieldType.js library function
	describe('lib/parse getFieldType.js Unit tests', () => {
		it('should return the name of Number constructor functions', () => {
			getFieldType(Number).should.equal('Number');
		});

		it('should return the name of String constructor functions', () => {
			getFieldType(String).should.equal('String');
		});

		it('should return the name of Boolean constructor functions', () => {
			getFieldType(Boolean).should.equal('Boolean');
		});

		it('should return the name of Date constructor functions', () => {
			getFieldType(Date).should.equal('Date');
		});

		it('should return the name dom for declared types', () => {
			getFieldType('dom').should.equal('dom');
		});

		it('should return the name url for declared types', () => {
			getFieldType('url').should.equal('url');
		});

		it('should return the name img for declared types', () => {
			getFieldType('img').should.equal('img');
		});

		it('should return the name pdf for declared types', () => {
			getFieldType('pdf').should.equal('pdf');
		});

		it('should return the name xls for declared types', () => {
			getFieldType('xls').should.equal('xls');
		});

		it('should return the name of array elements with constructor functions', () => {
			getFieldType([Date]).should.equal('Array_Date');
		});

		it('should return the name of array elements with declared types', () => {
			getFieldType(['dom']).should.equal('Array_dom');
		});

		it('should return invalid for anything else', () => {
			getFieldType(true).should.equal('Invalid');
		});
	});
