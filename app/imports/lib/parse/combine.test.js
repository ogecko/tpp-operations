/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { parse }			from '/imports/lib/parse';


// Simple unit tests for combine.js library function
describe('lib/parse combine.js Unit tests', () => {
	it('should leave fields that are already set untouched', () => {
		const result = parse.combine(
			{ isSet: true },
			['abc def', 'deg']
		);
		expect(result).not.to.exist;
	});

	it('should combine a could of fields', () => {
		const result = parse.combine(
			{ isSet: false },
			['abc def', 'deg']
		);
		result.should.equal('abc def,deg');
	});

	it('should remove all blank entries', () => {
		const result = parse.combine(
			{ isSet: false },
			['a', false, undefined, '', null, 0, 'b']
		);
		result.should.equal('a,b');
	});

	it('should trim all entries', () => {
		const result = parse.combine(
			{ isSet: false },
			[' a', 'b ', '   c   ']
		);
		result.should.equal('a,b,c');
	});

	it('should remove any entries that are trimmed to nothing', () => {
		const result = parse.combine(
			{ isSet: false },
			['  a ', '   ', '   \n  ', '  c']
		);
		result.should.equal('a,c');
	});

	it('should allow custom separators', () => {
		const result = parse.combine(
			{ isSet: false },
			['a', false, undefined, '', null, 0, '   \n\n\n', 'b'],
			'|'
		);
		result.should.equal('a|b');
	});
});
