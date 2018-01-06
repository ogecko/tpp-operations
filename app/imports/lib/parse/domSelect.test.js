/* eslint-env mocha */
import { chai, expect }				from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { stubs, spies }				from 'meteor/practicalmeteor:sinon';
import { SimpleSchema }				from 'meteor/aldeed:simple-schema';
import cheerio						from 'cheerio';
import { parse }						from '/imports/lib/parse';

// Simple unit tests for parse.domSelect library function
describe('lib/parse domSelect Unit tests', () => {
	if (Meteor.isClient) return undefined;

	// Setup mock test data
	const mockHTML = '\
			<body>\
				<div class="ui input">\
					<input type="text" placeholder="Search..." size="80">\
					<input id="rev" name="rev" type="text" value="182795" size="5" maxlength="12">\
					<span id="sent" class="g3" title="Tue, Nov 10, 2015 11:27 AM GMT+1000">Nov 10 (1 day ago)</span>\
					This is a test\
				</div>\
				<div class="ui list">\
					<div class="item" size="3" price="$20.50">Apples</div>\
					<div class="item" size="30" price="$10.50">Pears</div>\
					<div class="item" size="300" price="$5.00">Oranges</div>\
				</div>\
			</body>';
	const mockDOM = cheerio.load(mockHTML)('body');
	const $ = cheerio.load('<body></body>');							// used just to get the cheerio function

	let result;
	const field = {};

	beforeEach(() => {
		field.isSet = false;
		field.value = 10;
		field.siblingField = () => { return { isSet: true, value: mockDOM }; };
		field.unset = () => { };
	});


	it('should not do anything if the field is already set', () => {
		field.isSet = true;
		result = parse.domSelect(field, String, 'selector', 'name');
		should.not.exist(result);
	});

	it('should unset the value if the sibling field source is not set', () => {
		stubs.create('sibling', field, 'siblingField').returns({ isSet: false, value: 20 });
		spies.create('unset', field, 'unset');
		result = parse.domSelect(field, String, 'selector', 'name');
		should.not.exist(result);
		expect(spies.unset).to.have.been.calledWith();
	});

	it('should be able to extract a numeric attribute', () => {
		result = parse.domSelect(field, Number, '#rev', 'size');
		result.should.equal(5);
	});

	it('should be able to extract a string attribute', () => {
		result = parse.domSelect(field, String, '#rev', 'size');
		result.should.equal('5');
	});

	it('should be able to extract a date value', () => {
		result = parse.domSelect(field, Date, '#sent', 'title');
		result.toISOString().should.equal('2015-11-10T01:27:00.000Z');
	});

	it('should be able to extract a number value from input element', () => {
		result = parse.domSelect(field, Number, '#rev');
		result.should.equal(182795);
	});

	it('should be able to extract a string from second input element', () => {
		result = parse.domSelect(field, Number, 'input:nth-child(2)');
		result.should.equal(182795);
	});

	it('should be able to extract a string from third input element', () => {
		result = parse.domSelect(field, String, '.item:nth-child(3)');
		result.should.equal('Oranges');
	});

	it('should be able to extract the number of selected elements', () => {
		result = parse.domSelect(field, 'length', 'div');					// extract the number of divs
		result.should.equal(5);
	});

	it('should be able to extract an array of strings from selected elements', () => {
		result = parse.domSelect(field, [String], '.item');
		result.should.deep.equal(['Apples','Pears','Oranges']);					// extract array of text from all tags with class=item
	});

	it('should be able to extract an array of strings from selected element attributes', () => {
		result = parse.domSelect(field, [String], 'div', 'class');		// extract array of class names from divs
		result.should.deep.equal(['ui input','ui list','item','item','item']);
	});

	it('should be able to extract an array of numbers from selected element attributes', () => {
		result = parse.domSelect(field, [Number], 'input', 'size');
		result.should.deep.equal([80, 5]);
	});

	it('should be able to parse the HTML content and return dom', () => {
		stubs.create('sibling', field, 'siblingField').returns({ isSet: true, value: mockHTML });
		result = parse.domSelect(field, 'dom', 'body');					// parse the mockHTML and return a dom
		expect(stubs.sibling).to.have.been.calledWith('dom');
		$('.item', result).eq(1).text().should.equal('Pears');
	});

	it('should be able to extract an array of doms', () => {
		result = parse.domSelect(field, ['dom'], 'div');					// extract array of doms for all divs
		$('#rev', result[0].dom).attr('size').should.equal('5');					// within first div, search for id=#rev and return its size attribute
		$('.item', result[1].dom).text().should.equal('ApplesPearsOranges');		// within second div, search for class=item and return all text
	});

	it('should be able to use parse.domSelect in simple-schemas', () => {
		const test1Schema = new SimpleSchema({
			dom: {
				type: Object, optional: true, blackbox: true,
				autoValue: function() { return parse.domCheck(this); }
			},
			inputsize: {
				type: Number, max: 2,
				autoValue: function() { return parse.domSelect(this, Number, 'input:nth-child(2)', 'size'); }
			},
			fruits: {
				type: [String],
				autoValue: function() { return parse.domSelect(this, [String], '.item'); }
			}
		});
		var response = { dom: mockDOM };
		test1Schema.clean(response, { extendAutoValueContext:{isParse:true} });
		test1Schema.clean(response, { extendAutoValueContext:{isScrub:true} });
		response.inputsize.should.equal(5);
		response.fruits.should.deep.equal(['Apples','Pears','Oranges']);

		var ctx = test1Schema.newContext();
		ctx.validate(response); 
		ctx.invalidKeys().map(key => ctx.keyErrorMessage(key.name)).join('; ')
			.should.equal('Inputsize cannot exceed 2');
	});

	it('should be able to use parse.domSelect in nested simple-schemas', () => {
		const itemSchema = new SimpleSchema({
			dom: {
				type: Object, optional: true, blackbox: true,
				autoValue: function() { return parse.domCheck(this); }
			},
			name: {
				type: String,
				autoValue: function() { return parse.domSelect(this, String, ''); }
			},
			quantity: {
				type: Number,
				autoValue: function() { return parse.domSelect(this, Number, '','size'); }
			},
			price: {
				type: Number, decimal:true, max: 15,
				autoValue: function() { return parse.domSelect(this, Number, '','price'); }
			}
		});
		let test1Schema = new SimpleSchema({
			dom: {
				type: Object, optional: true, blackbox: true,
				autoValue: function() { return parse.domCheck(this); }
			},
			inputsize: {
				type: Number, max: 2,
				autoValue: function() { return parse.domSelect(this, Number, 'input:nth-child(2)','size'); }
			},
			fruits: {
				type: [itemSchema],
				autoValue: function() { return parse.domSelect(this, ['dom'], '.item'); }
			}
		});

		const response = { dom: mockDOM };
		test1Schema.clean(response, { extendAutoValueContext:{isParse:true} });
		test1Schema.clean(response, { extendAutoValueContext:{isScrub:true} });
		response.inputsize.should.equal(5);

		const ctx = test1Schema.newContext();
		ctx.validate(response);
		ctx.invalidKeys().map(key => ctx.keyErrorMessage(key.name)).join('; ')
			.should.equal('Inputsize cannot exceed 2; Price cannot exceed 15');
	});
});

