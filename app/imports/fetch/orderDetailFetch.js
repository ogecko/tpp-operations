import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { orderDetailSpec } from './orderDetailSpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('fetch', { concurrency: 2 }, orderDetailFetch);

export function orderDetailFetch(job, cb) {
	console.log('Calling orderDetailFetch on Order ', job.data.orderNo);
	if (Meteor.isServer) {
		const web = Nightmare()    	// { show: true }
		.use(loginRocketSpark('/dashboard/shop_settings/order_history'))
		.wait('#orders-vue > div > table')
		.goto('https://tpp.rocketsparkau.com/dashboard/shop_settings/orders/'+job.data.orderNo)
		.wait('#view-order > div > .order-header')
		.evaluate(function () {
			return document.querySelector('body').outerHTML;
		})
		.end()
		.then(function (body) {
			const result = parse.html(body, orderDetailSpec);
			console.log('detail parse', JSON.stringify(result, undefined, 2));
			orders.update(result.data);
			jobQueue.dispatch('location', { orderNo: result.data.orderNo });
			job.done(); cb();
		})
		.catch(function (error) {
			console.error('Search failed:', error);
			job.fail(); cb();
		});
	}
}
