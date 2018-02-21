/* eslint-env mocha */
import { chai }							from 'meteor/practicalmeteor:chai'; chai.should();
import SimpleSchema 				from 'simpl-schema';
import { validateWithSchema }			from './validateWithSchema.js';

// Simple unit tests for validateWithSchema library function
describe('lib/parse validateWithSchema Unit tests', () => {
	// Setup mock schema
	let doc = {};
	const BookSchema = new SimpleSchema({
		title: {
			type: String,
			label: 'Title',
			max: 200,
		},
		author: {
			type: String,
			label: 'Author',
		},
		copies: {
			type: Number,
			label: 'Number of copies',
			min: 0,
		},
		copiesArray: {
			type: Array,
			label: 'Array of copies',
			optional: true,
		},
		'copiesArray.$': {
			type: Number,
			min: 0,
			label: 'Array of copies',
			optional: true,
		},
		lastCheckedOut: {
			type: Date,
			label: 'Last date this book was checked out',
			optional: true,
		},
		summary: {
			type: String,
			label: 'Brief summary',
			optional: true,
			max: 1000,
		},
	});


	beforeEach(() => {
		// Initialise mock doc data to parse
		doc = {
			title: 'To Kill a Mockingbird',
			author: 'Harper Lee',
			copies: '5',
			lastChekedOut: Date.now(),
			summary: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical success when it was first published in 1960. It went on to win the Pulitzer Prize in 1961 and was later made into an Academy Award-winning film, also a classic.',
		};
	});

	it('should be able to parse a valid doc, converting types, no errors', () => {
		const result = validateWithSchema(doc, BookSchema);
		result.data.copies.should.equal(5);
		result.errors.length.should.equal(0);
	});

	it('should be able to identify mismatch of min Number', () => {
		doc.copies = -1;
		const result = validateWithSchema(doc, BookSchema);
		result.errors.join(', ').should.equal('Number of copies must be at least 0 (-1)');
	});

	it('should be able to identify mismatch of string length', () => {
		doc.title = doc.summary;
		const result = validateWithSchema(doc, BookSchema);
		result.errors.join(', ').should.contain('Title cannot exceed 200 characters');
	});


	it('should be able to consolidate duplicates of the same message', () => {
		doc.copiesArray = [-1, -5, 10, -3];
		const result = validateWithSchema(doc, BookSchema);
		result.errors.join(', ').should.contain('Array of copies must be at least 0');
	});
});

