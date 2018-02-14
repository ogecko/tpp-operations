import { _ } 					from 'meteor/underscore';
import SimpleSchema			    from 'simpl-schema';
import { validateWithSchema }	from './utility/validateWithSchema.js';
import numeral 					from 'numeral';

// Convert the csv content into an object based on the schema defined
export function parseCSV(content, schema, separator = ',', ignoreHeader = true, limit = undefined) {
	const args = new SimpleSchema({
		content: 		{ type: String },
		schema: 		{ type: SimpleSchema },
		separator: 		{ type: String, optional: true },
		ignoreHeader: 	{ type: Boolean, optional: true },
		limit: 			{ type: Number, min: 1, optional: true },
	});
	args.validate({ content, schema, separator, ignoreHeader, limit });

	let contentArray = content.split('\n');
	if (ignoreHeader) 	contentArray = _.drop(contentArray, 1);
	if (limit) 			contentArray = _.head(contentArray, limit);

	const parsedData = _.map(contentArray, function(rawRow) {
		const parsedRow = {};
		const fieldNames = schema._firstLevelSchemaKeys;
		_.each(rawRow.split(separator), function(rawField, index) {
			if (index < fieldNames.length) {
				const fieldName = fieldNames[index];
				const fieldType = schema.getDefinition(fieldName).type.name;
				let val = undefined;
				if (fieldType === 'Number')
					val = numeral().unformat(rawField);
				else if (fieldType === 'Date')
					val = new Date(rawField);
				else
					val = rawField;
				parsedRow[fieldNames[index]] = val;
			}
		});
		return parsedRow;
	});

	// validate each row of the csv file ans store all parsing errors
	const results = { data: [], errors: [] };
	_.each(parsedData, function(data) {
		const validationResults =  validateWithSchema(data, schema);
		results.data.push(validationResults.data);
		_.each(validationResults.errors, function(error) {
			results.errors.push(error);
		});
	});

	// return the data as a straight array on the data property
	return results;
}


