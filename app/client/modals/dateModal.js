import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import UIkit from 'uikit';
import moment from 'moment';

Template.dateModal.onRendered(function() {
	const self = this;

	// Cannot use Blaze Event Handler as UIKit moves the modal to the base <BODY> when shwon
	UIkit.util.on('#date-modal  .js-select-date-action', 'click', () => {
		const day = moment(document.getElementById('js-date-input').value, 'YYYY-MM-DD').toDate();
		const ship = document.getElementById('js-ship-input').checked;
		const add = document.getElementById('js-add-input').checked;
		console.log(`select date: ${day}, include shipped: ${ship}, add to selection: ${add}`);
		if (!add) Meteor.call('select none');
		Meteor.call('select date', day, ship);
	});
});

// function selectDates(event) {
// 	
// }