import { Nightmare } from '/imports/lib/nightmare';
import { parse } from '/imports/lib/parse';
import { orders } from '/imports/api/orders';
import { jobQueue } from '/imports/api/jobQueue';
import { fetchOrderSpec } from './fetchOrderSpec.js';
import { loginRocketSpark } from './loginRocketSpark.js';
import { odooShip } from './odooShip.js';

jobQueue.recruitWorker('ship order', { concurrency: 2 }, shipOrder);

export function shipOrder(job, cb) {
	const orderNo = job.data.orderNo;
	const nextOrderDeliveryShipment = job.data.delivery;
	console.log(`Calling odooShip on Order ${orderNo}/${nextOrderDeliveryShipment}`);

	if (Meteor.isServer) {
	// orders below 100000 are for rocketspark, the rest for odoo
	(orderNo < 100000) ? rocketsparkShip(orderNo) : odooShip(orderNo, nextOrderDeliveryShipment)
		.then(result => {
			console.log(`Shipped order ${orderNo}/${nextOrderDeliveryShipment}:`, result);
			job.done(); cb();
		})
		.catch(error => {
			console.log(`Ship failed ${orderNo}/${nextOrderDeliveryShipment}:`, error);
			job.fail(); cb();
		});
	}
}

function rocketsparkShip(orderNo) {
	return Nightmare({ pollInterval: 50 })    	// { show: true }
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
}