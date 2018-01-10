import moment from 'moment-timezone';

// when finding the moment of a date, we need to be aware of the timezone the date is in
// ie the moment of the begining of 1/1/2018 is different in Sydney as opposed to Los Angelos 
export const DEFAULT_TZ = 'Australia/Sydney';
export function dates(s='') {

	if (_.isDate(s)) return s;

	const cleaned = s
		.replace(/ or .*/,'')
		.replace(/ & .*/,'')
		.replace(/.*asap.*/i, moment().format('DD MM YYYY'))
		.replace(/.*soonest possible.*/i, moment().format('DD MM YYYY'))
	;
	// try a common format eg 01/12/2017 or 01/12/17
	let try1 = moment.tz(cleaned, 'DD MM YYYY', DEFAULT_TZ);

	// if invalid, try another common format eg 1st December 2017
	if (!try1.isValid()) {
		try1 = moment.tz(cleaned, 'DD MMM YYYY', DEFAULT_TZ);
	}

	// check for minimum acceptable year, replace with current year otherwise
	if (try1.isBefore('2017-01-01')) {
		console.log(`Date before 1/1/2017, input "${s}"`);
		try1.year(moment.tz(DEFAULT_TZ).year());
	}

	// check for invalid date, replace with current date otherwise
	if (!try1.isValid()) {
		console.log(`Invalid Date, input "${s}"`);
		try1 = moment.tz(DEFAULT_TZ);
	}


	return try1.toDate();
}