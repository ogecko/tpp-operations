import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';

/**
 * @summary validate the selector and modifer based on filterField definitions
 *
 * This function is intended to be used on the server (in the publish method)
 * to validate that the clients requested selector and modifier are correctly formatted
 *
 */
 export function _validateParams(defns, selector, modifier) {
 	const filterFieldSpec = new SimpleSchema({
		label:		{ type: String, optional: true },	// label on filterBy popup
		param:		{ type: String },					// URL query parameter name
		field:		{ type: String, optional: true },	// document field name
		limit:		{ type: Number, optional: true },					// max no aggr field values
		sort:		{ type: Object, optional: true, blackbox: true },	// sort of aggr pipeline
		operator:	{ type: String },					// selector operator
 	});


	// check for an Array of filter field definitions
	const defnsSchema = new SimpleSchema({
		defns: 		{ type: Array },
		'defns.$': 	{ type: filterFieldSpec }
	});
	defnsSchema.validate({ defns });

	// check for an object that has field restrictions based on MongoDB operators
	const selectorSchema = new SimpleSchema({
		$eq:		{ type: String, optional: true },
		$in:		{ type: Array,  optional: true },
		'$in.$':	{ type: String, optional: true },
		$regex:		{ type: String, optional: true },
		$options:	{ type: String, optional: true },
		$lunr:		{ type: String, optional: true },
	});
	const fieldsSelectorSchema = new SimpleSchema(basedOn(defns, selectorSchema));
	fieldsSelectorSchema.validate(selector);


	// check for an object with valid modifier fields based on MongoDB
	const modifierSchema = new SimpleSchema({
		skip:		{ type: Number },
		limit:		{ type: Number },
		sort:		{ type: Object, blackbox:true },
	});
	modifierSchema.validate(modifier);

	return;
}

function getFieldList(defns) {
	return _.map(defns, (defn) => (defn.field ? defn.field : defn.param));
}

function basedOn(defns, schema) {
	return _.reduce(getFieldList(defns), (memo, field) => {
		memo[field] = { type: schema, optional: true };
		return memo;
	}, { });
}

