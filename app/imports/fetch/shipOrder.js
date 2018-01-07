import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { fetchOrderSpec } from './fetchOrderSpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('ship order', { concurrency: 2 }, shipOrder);

export function shipOrder(job, cb) {
	console.log('Calling shipOrder on Order ', job.data.orderNo);
	if (Meteor.isServer) {
		const web = Nightmare()    	// { show: true }
		.use(loginRocketSpark('/dashboard/shop_settings/orders/'+job.data.orderNo))
		.wait('#checkbox-shipping-'+job.data.orderNo)
		.click('#checkbox-shipping-'+job.data.orderNo)
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
			console.log(`done ship ${job.data.orderNo}:`,msg);
			orders.update({ orderNo: job.data.orderNo, isShipped: '1' });
			job.done(); cb();
		})
		.catch(function (error) {
			console.error('Ship failed:', error);
			orders.update({ orderNo: job.data.orderNo, isShipped: '1' });
			job.fail(); cb();
		});
	}
}
