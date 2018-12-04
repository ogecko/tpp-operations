/* eslint-env mocha */
import { chai }				from 'meteor/practicalmeteor:chai'; chai.should();
import { splitCSVrow }		from './splitCSVrow.js';

// Simple unit tests for cheerio.js library function
describe('lib/parse splitCSVrow.js Unit tests', () => {
    it('should parse a csv row with nothing', () => {
		splitCSVrow('').should.deep.equal([ '' ]);
	});

    it('should parse a csv row which is undefined', () => {
		splitCSVrow().should.deep.equal([ '' ]);
	});

    it('should parse a normal csv row', () => {
		splitCSVrow('a,b,c,d,e,f').should.deep.equal([ 'a', 'b', 'c', 'd', 'e', 'f' ]);
	});

	it('should parse a csv row with empty fields', () => {
		splitCSVrow(',b,,,e,').should.deep.equal([ '', 'b', '', '', 'e', '' ]);
	});

	it('should parse a csv row with quoted fields', () => {
		splitCSVrow('a,"b,e",c,d,e,f').should.deep.equal([ 'a', 'b,e', 'c', 'd', 'e', 'f' ]);
	});

	it('should parse a csv row with multiple quoted fields', () => {
		splitCSVrow('"a,d,f,","b,e",c,e,"f,h"').should.deep.equal([ 'a,d,f,', 'b,e', 'c', 'e', 'f,h' ]);
	});

	it('should parse a csv row with trailing characters after quote', () => {
		splitCSVrow('a,"b"c,e,d,f').should.deep.equal([ 'a', 'bc', 'e', 'd', 'f' ]);
	});
	it('should parse a csv row with trailing characters before and after quote', () => {
		splitCSVrow('a,g"b"c,e,d,f').should.deep.equal([ 'a', 'gbc', 'e', 'd', 'f' ]);
	});
});

