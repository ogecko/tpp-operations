import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import gmServices from '@google/maps';

const googleMapsClient = gmServices.createClient({ key: Meteor.settings.public.googleAPIkey, Promise });

jobQueue.recruitWorker('location', { concurrency: 2 }, orderLocationFetch);

export function orderLocationFetch(job, cb) {
	console.log('Calling orderLocationFetch on Order ', job.data.orderNo);
	if (Meteor.isServer && job.data.orderNo) {
		const doc = orders.orderCollection.findOne({ orderNo: job.data.orderNo });
		if (doc) {
			orders.orderCollection.update({ orderNo: job.data.orderNo }, { $unset: { shipLocation: ''} });
			const addr = _.rest(doc.shipAddress).join(' ')+', Australia';
			console.log('GeoCoding ', JSON.stringify(addr, undefined, 2));
			googleMapsClient.geocode({ address: addr }).asPromise()
			.then(response => {
				if (response.json.results.length > 0) {
					const docUpdate = {
						orderNo: job.data.orderNo,
						shipLocation: {
							...response.json.results[0].geometry.location,
							geoAddr: response.json.results[0].formatted_address,
							partial: response.json.results[0].partial_match ? '(Partial Match)' : undefined,
						}
					}
					console.log('location', JSON.stringify(docUpdate, undefined, 2));
					// console.log('location', JSON.stringify(response, undefined, 2));
					orders.update(docUpdate);
				}
			});

		}
	}
	job.done(); cb();
}
