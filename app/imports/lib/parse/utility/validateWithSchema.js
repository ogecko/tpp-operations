import { _ } from 'meteor/underscore';

// used by parse.html and parse.csv to clean the data and get a list of parsing errors
export function validateWithSchema(doc, schema) {
	// Clean the document of any html or dom structures
	schema.clean(doc, { mutate: true, extendAutoValueContext: { isScrub: true } });

	// validate the document
	const context = schema.newContext();
	context.validate(doc);

	// get a list of any errors, adding the error message
	const errors = _.map(context.validationErrors(), key => {
		const message = `${context.keyErrorMessage(key.name)} (${key.value})`;
		return _.extend({ message }, key);
	});


	const consolidatedErrors = _.chain(errors)
		.countBy(err => err.message)
		.map((n, msg) => msg + ((n > 1) ? ` (${n} times)` : ''))
		.value();

	// return the parsed data and an array of any parsing errors
	return {
		data: doc,
		errors: consolidatedErrors,
	};
}
