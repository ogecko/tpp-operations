/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import parse			from '/imports/api/parse';

// Simple unit tests for csvParseWithSchema.js library function
describe('api/parse parseCSV.js Unit tests', function() {

	// Setup mock schema
	let doc = {};
	const BookSchema = new SimpleSchema({
		title: 			{ type:String, label: 'Title', max: 200 },
		author: 		{ type:String, label: 'Author' },
		copies: 		{ type:Number, label: 'Number of copies', min: 0 },
		lastCheckedOut: { type:Date,   label: 'Last date this book was checked out', optional: true },
		summary: 		{ type:String, label: 'Brief summary', optional: true, max: 1000 }
	});

	it('should be able to parse a valid csv, converting types, no errors', function() {
		doc =  `To Kill a Mockingbird,Harper Lee,5,1-jan-2015,The unforgettable novel of a childhood in a sleepy Southern town
				To Kill a Jackingbird,Harper Loo,2,10-jan-2012,The forgettable novel of a adulthood in a wakey Northern town`;
		const result = parse.csv(doc, BookSchema, ',', false);
		result.data.length.should.equal(2);
		result.data[0].title.should.equal('To Kill a Mockingbird');
		result.data[1].author.should.equal('Harper Loo');
		result.data[1].copies.should.equal(2);
		result.errors.length.should.equal(0);
	});


	it('should be able to parse a csv, converting types, and list any parsing errors', function() {
		doc =  `To Kill a Mockingbird,Harper Lee,5,1-jan-2015,The unforgettable novel of a childhood in a sleepy Southern town
				To Kill a Jackingbird,Harper Loo,-5,40-jan-2012,The forgettable novel of a adulthood in a wakey Northern town`;
		const result = parse.csv(doc, BookSchema, ',', false);
		result.data.length.should.equal(2);
		result.data[0].title.should.equal('To Kill a Mockingbird');
		result.data[1].author.should.equal('Harper Loo');
		result.errors.join('|').should.equal('Number of copies must be at least 0 (-5)|Last date this book was checked out is not a valid date (Invalid Date)');
	});

	it('should be able to parse a csv, ignoring the header row', function() {
		doc =  `Header row
				To Kill a Mockingbird,Harper Lee,5,1-jan-2015,The unforgettable novel of a childhood in a sleepy Southern town
				To Kill a Jackingbird,Harper Loo,-5,40-jan-2012,The forgettable novel of a adulthood in a wakey Northern town`;
		const result = parse.csv(doc, BookSchema, ',', true);
		result.data.length.should.equal(2);
		result.data[0].title.should.equal('To Kill a Mockingbird');
		result.data[1].author.should.equal('Harper Loo');
		result.errors.join('|').should.equal('Number of copies must be at least 0 (-5)|Last date this book was checked out is not a valid date (Invalid Date)');
	});

	it('should be able to parse a csv, ignoring the header row and limiting the returned rows', function() {
		doc =  `Header row
				To Kill a Mockingbird,Harper Lee,5,1-jan-2015,The unforgettable novel of a childhood in a sleepy Southern town
				To Kill a Jackingbird,Harper Loo,-5,40-jan-2012,The forgettable novel of a adulthood in a wakey Northern town`;
		const result = parse.csv(doc, BookSchema, ',', true, 1);
		result.data.length.should.equal(1);
		result.data[0].title.should.equal('To Kill a Mockingbird');
		result.data[0].author.should.equal('Harper Lee');
		result.errors.length.should.equal(0);
	});

	it('should be able to parse a csv, ignoring the header row and handling no data', function() {
		doc =  `Header row`;
		const result = parse.csv(doc, BookSchema, ',', true);
		// prettyJSON(result).should.equal('display it');
		result.data.length.should.equal(0);
		result.errors.length.should.equal(0);
	});
});

