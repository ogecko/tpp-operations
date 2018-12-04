import { Template } from 'meteor/templating';
import UIkit from 'uikit';

Template.orderActionMenu.events({
	'click .js-clear-all': (event, instance) => Meteor.call('select none'), 

	'click .js-select-all': (event, instance) => Meteor.call('select all'), 

	'click .js-select-multi': (event, instance) => Meteor.call('select multi'), 

	'click .js-select-todays': (event, instance) => Meteor.call('select todays'), 

	'click .js-toggle-ship-modal': (event, instance) => UIkit.modal('#ship-modal').show(),

	'click .js-toggle-date-modal': (event, instance) => UIkit.modal('#date-modal').show(),

	'click .js-assign-none': (event,instance) => Meteor.call('assign none'),

	'click .js-assign-selected-driver': (event,instance) => {
		const tgt = instance.$(event.currentTarget)[0];
		const driver = tgt.dataset.driver;
		console.log('Assign selected orders to driver ',driver);
		Meteor.call('assign selected', driver);
	},

	'click .js-label-bulk-order': (event) => {
		const el = document.getElementById('import-bulk');
		if (el) el.value = "";			// ensure that a change event is triggered even if same file name selected
	},

	'change .js-import-bulk-order': (event) => {
		file = event.target.files[0];
		if (file) {
			if (file.size > 30000) {
				UIkit.notification(`Bulk Order Import File is limited to 30k size ("${file.name}" is ${file.size/1000}k)`);
				return;
			}
			const reader = new FileReader();
			reader.onload = (event) => {
				Meteor.call('updateBulkOrder', file.name, event.target.result, (error, result) => {
					UIkit.notification(error ? error:result, { timeout: 10000 });
				});
			}
			reader.readAsText(file)
		}
	},

});

