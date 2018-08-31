import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { fetchOrderSpec } from './fetchOrderSpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';

jobQueue.recruitWorker('ship order', { concurrency: 2 }, shipOrder);

export function shipOrder(job, cb) {
	const orderNo = job.data.orderNo;
	console.log('Calling shipOrder on Order ', orderNo);

	// dont validate on rocketspark if orderNo is from odoo
	if (Meteor.isServer & orderNo < 100000) {
		const web = Nightmare({ pollInterval: 50 })    	// { show: true }
		.use(loginRocketSpark('/dashboard/shop_settings/orders/'+orderNo))
		.wait('#checkbox-shipping-'+orderNo)
		.click('#checkbox-shipping-'+orderNo)
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
			console.log(`Rocketspark Shipped order ${orderNo}:`, msg);
			job.done(); cb();
		})
		.catch(function (error) {
			console.log(`Rocketspark Ship failed ${orderNo}:`, error);
			job.fail(); cb();
		});
	}
}
