/* eslint-env mocha */
import { chai }			from 'meteor/practicalmeteor:chai'; chai.should();
import SimpleSchema 	from 'simpl-schema';
import { parse }		from '/imports/lib/parse';

// Simple unit tests for parse.class.js ary function
describe('lib/parse parseHTML.js  tests', function() {
	if (Meteor.isClient) return undefined;

	const content = `<body>
				<div class="ui input">
					<input type="text" placeholder="Search..." size="80">
					<input id="rev" name="rev" type="text" value="182795" size="5" maxlength="12">
					<span id="sent" class="g3" title="Tue, Nov 10, 2015 11:27 AM">Nov 10 (1 day ago)</span>
					This is a test
				</div>
				<div class="ui list">
					<div class="item" size="3" price="$20.50">Apples</div>
					<div class="item" size="30" price="$10.50">Pears</div>
					<div class="item" size="300" price="$5.00">Oranges</div>
				</div>
			</body>`;

	const schema = new SimpleSchema({
		dom: {
			type: Object, optional: true, blackbox: true,
			autoValue: function(doc) { return parse.domCheck(this); },
		},
		inputsize: {
			type: Number, max: 200,
			autoValue: function() { return parse.domSelect(this, Number, 'input:nth-child(2)', 'size'); },
		},
		fruits: {
			type: Array,
			autoValue: function() { return parse.domSelect(this, [String], '.item'); },
		},
		'fruits.$': {
			type: String,
		},
	});


	it('should be able to parse a valid html doc, converting types, no errors', function() {
		const result = parse.html(content, schema);
		result.data.inputsize.should.equal(5);
		result.data.fruits[0].should.equal('Apples');
		result.errors.join('|').should.equal('');
	});

});

