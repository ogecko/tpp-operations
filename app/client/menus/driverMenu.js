import { Template } from 'meteor/templating';
import { drivers } from '/imports/api/drivers';
import { Counter } from '/imports/lib/counter/client.js';


Template.driverAssignMenu.helpers({
	drivers: () => drivers.driverCollection, 
});


Template.driverDeliveryMenu.helpers({
	drivers: () => drivers.driverCollection, 
	deliveries: (driver) => {
		const count = Counter.valueCount('wc', 'driver', driver);
		return count ? `(${count} Orders)` : undefined;
	},
});


Template.driverMapMenu.helpers({
	drivers: () => drivers.driverCollection, 
	deliveries: (driver) => {
		const count = Counter.valueCount('wc', 'driver', driver);
		return count ? `(${count} Orders)` : undefined;
	},
});

