import moment from 'moment';

export function dates(s='') {

	if (_.isDate(s)) return s;

	const cleaned = s
		.replace(/ or .*/,'')
		.replace(/ & .*/,'')
		.replace(/.*asap.*/i, moment().format('DD MM YYYY'))
		.replace(/.*soonest possible.*/i, moment().format('DD MM YYYY'))
	;
	// try a common format eg 01/12/2017 or 01/12/17
	let try1 = moment(cleaned, 'DD MM YYYY');

	// if invalid, try another common format eg 1st December 2017
	if (!try1.isValid()) {
		try1 = moment(cleaned, 'DD MMM YYYY');
	}

	// check for minimum acceptable year, replace with current year otherwise
	if (try1.isBefore('2017-01-01')) {
		console.log(`Date before 1/1/2017, input "${s}"`);
		try1.year(moment().year());
	}

	// check for invalid date, replace with current date otherwise
	if (!try1.isValid()) {
		console.log(`Invalid Date, input "${s}"`);
		try1 = moment();
	}


	return try1.toDate();
}