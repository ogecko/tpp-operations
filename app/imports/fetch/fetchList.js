import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { fetchListSpec } from './fetchListSpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('fetch list', { concurrency: 2 }, fetchList);

export function fetchList(job, cb) {
	console.log('Calling fetchList');
	if (Meteor.isServer) {
		const web = Nightmare({ pollInterval: 50 })			// { show: true, pollInterval: 50 }
		.use(loginRocketSpark('/dashboard/shop_settings/orders'))
		.wait('#orders-vue > div > table')
		.evaluate(function () {
			return document.querySelector('body').outerHTML;
		})
		.end()
		.then(function (body) {
			const result = parse.html(body, fetchListSpec);
			// console.log('list parse', JSON.stringify(result, undefined, 2));
			orders.update(result.data.orders);
			console.log(`Received (${result.data.orders.length} orders)`);
			_.each(result.data.orders, order => {
				if (!orders.isFetched(order.orderNo)) {
					Meteor.call('fetch order', order.orderNo);
				}
			});
			job.done(); cb();
		})
		.catch(function (error) {
			console.log('error from fetchlist', error);
			job.fail(); cb();
		});
	}
}

