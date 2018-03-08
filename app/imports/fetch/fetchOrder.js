import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { fetchOrderSpec } from './fetchOrderSpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('fetch order', { concurrency: 2 }, fetchOrder);

export function fetchOrder(job, cb) {
	console.log('Calling fetchOrder on Order ', job.data.orderNo);
	if (Meteor.isServer) {
		const web = Nightmare({ pollInterval: 50 })    	// { show: true }
		.use(loginRocketSpark('/dashboard/shop_settings/orders/'+job.data.orderNo))
		.wait('#view-order > div > .order-header')
		.evaluate(function () {
			return document.querySelector('body').outerHTML;
		})
		.end()
		.then(function (body) {
			const result = parse.html(body, fetchOrderSpec);
			console.log('detail parse', JSON.stringify(result, undefined, 2));
			orders.update(result.data);
			Meteor.call('locate order', result.data.orderNo);
			job.done(); cb();
		})
		.catch(function (error) {
			console.log('Search failed:', error);
			job.fail(); cb();
		});
	}
}
