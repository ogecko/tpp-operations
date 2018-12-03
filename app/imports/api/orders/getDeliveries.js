import { parse } from '/imports/lib/parse';
import moment from 'moment';


// convert a string of comma separated dates into an array of delivery structures
export function getDeliveries(deliveryDates) {
	if (!_.isString(deliveryDates)) return [];

	return _.chain(deliveryDates.split(','))
		.map((str, id) => {
			const raw = str.trim();
			const date = parse.dates(raw.replace(/\s*X$/i,''));
			const fmt = moment(date).format('DD-MMM-YY');
			const isShipped = raw.match(/X$/i) ? true : false;
			return { id, raw, fmt, date, isShipped };
		})
		.sortBy('date')
		.value();
}


export function getIsShippedAll(deliveryDates) {
	if (!_.isString(deliveryDates)) return '0';
	return _.chain(deliveryDates.split(','))
		.map((str, id) => {
			const raw = str.trim();
			const isShipped = raw.match(/X$/i) ? true : false;
			return isShipped;
		})
		.every()
		.value() ? '1' : '0';
}

// toggle the isShipped flag on a particular shipment
export function toggleDeliveryShipment(deliveryDates, idToMatch) {
	if (!_.isString(deliveryDates)) return deliveryDates;

	return _.chain(deliveryDates.split(','))
		.map((str, id) => {
			if (id == idToMatch) {
				const raw = str.trim();
				const isShipped = raw.match(/X$/i) ? true : false;
				if (isShipped) return raw.replace(/X$/i, '');
				if (!isShipped) return raw.replace(/$/, 'x');
			}
			return str;
		})
		.map(str => str.trim())
		.value()
		.join(', ');
}

// set isShipped on the next delivery
export function setDeliveryShipment(deliveryDates) {
	if (!_.isString(deliveryDates)) return deliveryDates;

	const deliveries = getDeliveries(deliveryDates);
	const target = _.first(_.where(deliveries, { isShipped: false}));
	if (target)	return toggleDeliveryShipment(deliveryDates, target.id);
	return deliveryDates;
}

// get the next delivery shipment date
export function getNextDeliveryShipment(deliveryDates) {
	if (!_.isString(deliveryDates)) return undefined;

	const deliveries = getDeliveries(deliveryDates);
	const target = _.first(_.where(deliveries, { isShipped: false}));
	if (target)	return target.raw;
	return undefined;
}
