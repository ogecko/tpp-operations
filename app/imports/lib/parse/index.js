import { Meteor } from 'meteor/meteor';
import { combine } from './combine.js';
import { parseCSV } from './parseCSV.js';
import { parseCSVMarkup } from './parseCSVMarkup.js';
import { parseHTML } from './parseHTML.js';
import { parseRegex } from './parseRegex.js';
import { domCheck } from './domCheck.js';
import { domSelect } from './domSelect.js';
import { unescapeHtml } from './utility/unescapeHtml.js';
import { dates } from './utility/dates.js';


export const parse = {
	combine,
	domCheck,
	domSelect,
	unescapeHtml,
	dates,
	html: parseHTML,
	csv: parseCSV,
	csvMarkup: parseCSVMarkup,
	regex: parseRegex,
};


