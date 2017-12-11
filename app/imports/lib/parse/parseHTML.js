import { check, Match } 		from 'meteor/check';
import { SimpleSchema }			from 'meteor/aldeed:simple-schema';
import cheerio					from 'cheerio';
import { isHtml }				from './utility/isHtml.js';
import { validateWithSchema }	from './utility/validateWithSchema.js';

// Convert the html content into an object based on the schema defined
export function parseHTML(content, schema) {
	check(content, Match.Where(isHtml));
	check(schema, SimpleSchema);

	// Parse the HTML using cherio and setup as a field in the document
	// Schema entries should use parse.domSelect() to pluck values out of this field
	const doc = { dom: cheerio.load(content)('body') };

	// Clean the document with the schema
	schema.clean(doc, { extendAutoValueContext: { isParse: true } });

	// Parse the document with the schema, assuming schema's autofill funcions have extractHtml calls
	return validateWithSchema(doc, schema);
}

