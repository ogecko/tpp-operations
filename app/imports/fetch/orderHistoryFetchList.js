import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { orderHistorySpec } from './orderHistorySpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('fetch list', { concurrency: 1 }, orderHistoryFetchList);

export function orderHistoryFetchList(job, cb) {
	console.log('Calling orderHistoryFetchList');
	if (Meteor.isServer) {
		const web = Nightmare()			// { show: true }
		.use(loginRocketSpark('/dashboard/shop_settings/order_history'))
		.wait('#orders-vue > div > table')
		.evaluate(function () {
			return document.querySelector('body').outerHTML;
		})
		.end()
		.then(function (body) {
			const result = parse.html(body, orderHistorySpec);
			// console.log('list parse', JSON.stringify(result, undefined, 2));
			orders.update(result.data.orders);
			console.log(`Dispatched requests for details on (${result.data.orders.length} orders)`);
			_.each(result.data.orders, order => {
				if (!orders.isFetched(order.orderNo)) {
			  		jobQueue.dispatch('fetch', { orderNo: order.orderNo }, { retries: 3, wait: 10*1000 });
				}
			});
			job.done(); cb();
		})
		.catch(function (error) {
			console.error('Search failed:', error);
			job.fail(); cb();
		});
	}
}

