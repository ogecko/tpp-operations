import { _ } 					from 'meteor/underscore';
import { SimpleSchema }			from 'meteor/aldeed:simple-schema';
import { validateWithSchema }	from './utility/validateWithSchema.js';


// Convert the csv content into an object based on the schema defined
export function parseCSVMarkup(content, separator = ',') {
	const args = new SimpleSchema({
		content: 		{ type: String },
		separator: 		{ type: String },
	});
	args.validate({ content, separator });

	const contentArray = content.split(separator);
	const parsedData = [];
	let parsedRow = {};
	let fieldName = '';

	contentArray.forEach((item, i) => {
		if (i % 2 === 0) {						// even items are field names
			const lines = item.split('\n');
			if (lines.length > 1
				&& lines[0].length === 0		// new line right after separator marks end of row
				&& _.size(parsedRow) > 0) {
				parsedData.push(parsedRow);
				parsedRow = {};
			}
			fieldName = lines[lines.length - 1];
		} else {								// odd items are values
			if (fieldName) {
				parsedRow[fieldName] = item;
			}
		}
	});

	if (_.size(parsedRow) > 0) {
		parsedData.push(parsedRow);
	}

	return parsedData;
}


