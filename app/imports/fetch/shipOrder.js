import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { fetchOrderSpec } from './fetchOrderSpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('ship order', { concurrency: 2 }, shipOrder);

export function shipOrder(job, cb) {
	const jobNo = job.data.orderNo;
	console.log('Calling shipOrder on Order ', jobNo);
	if (Meteor.isServer) {
		const web = Nightmare({ pollInterval: 50 })    	// { show: true }
		.use(loginRocketSpark('/dashboard/shop_settings/orders/'+jobNo))
		.wait('#checkbox-shipping-'+jobNo)
		.click('#checkbox-shipping-'+jobNo)
		.wait('.save-and-send')
		.click('.save-and-send')
		.wait('.send')
		.click('.send')
		.wait('.message-sent-success-message')
		.evaluate(function () {
			return document.querySelector('.message-sent-success-message > h2').innerHTML;
		})
		.end()
		.then(function (msg) {
			console.log(`Ship done ${jobNo}:`, msg);
			orders.update({ orderNo: jobNo, isShipped: '1' });
			job.done(); cb();
		})
		.catch(function (error) {
			console.error(`Ship failed ${jobNo}:`, error);
			orders.update({ orderNo: jobNo, isShipped: '1' });
			job.fail(); cb();
		});
	}
}
