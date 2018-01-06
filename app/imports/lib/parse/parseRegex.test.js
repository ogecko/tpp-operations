/* eslint-env mocha */
import { chai }	from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { parse }	from '/imports/lib/parse';

// Simple unit tests for csvParseWithSchema.js library function
describe('lib/parse parseRegx.js Unit tests', function() {
	it('should ignore if the target is already set', () => {
		const result = parse.regex({ isSet: true }, 'test abcdef', /test (.*)/, '$1');
		should.not.exist(result);
	});

	it('should ignore if regular expression is invalid', () => {
		const result = parse.regex({ isSet: false }, 'test abcdef', 'blah', '$1');
		should.not.exist(result);
	});

	it('should ignore if string is invalid', () => {
		const result = parse.regex({ isSet: false }, undefined, /test (.*)/, '$1');
		should.not.exist(result);
	});

	it('should extract the first match in a string', () => {
		const result = parse.regex({ isSet: false }, 'test abcdef', /test (.*)/, '$1');
		result.should.equal('abcdef');
	});

	it('should convert non-strings to strings before trying to match', () => {
		const result = parse.regex({ isSet: false }, 20, /(.*)/, '$1');
		result.should.equal('20');
	});
});
