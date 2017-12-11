import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { orderHistorySpec } from './orderHistorySpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('fetch at', { concurrency: 1 }, orderHistoryFetchAt);

export function orderHistoryFetchAt(job, cb) {
	console.log('Calling orderHistoryFetchAt');
	if (Meteor.isServer) {
		const web = Nightmare()    	// { show: true }
		.use(loginRocketSpark('/dashboard/shop_settings/order_history'))
		.wait('.chosen-drop')
		// .goto('https://sebastian-kadziela.rocketsparkau.com/dashboard/shop_settings/order_history/'+job.data.orderNo+'/')
		.click('#page-selection')
		.wait(5000)
		.click('.chosen-results > li[data-option-array-index="2"]')
		.wait(5000)
		.evaluate(function () {
			return document.querySelector('body').outerHTML;
		})
		.end()
		.then(function (body) {
			const result = parse.html(body, orderHistorySpec);
			orders.update(result.data.orders);
			console.log(`Dispatched requests for details at (${result.data.orders.length} orders)`);
			_.each(result.data.orders, order => {
				console.log(order.orderNo);
		  		// jobQueue.dispatch('fetch', { orderNo: order.orderNo }, { retries: 3, wait: 10*1000 });
			});
			job.done(); cb();
		})
		.catch(function (error) {
			console.error('Search failed:', error);
			job.fail(); cb();
		});
	}
}

