import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';
import { select } from '/imports/lib/select';
import { isSignedIn } from '/imports/lib/isSignedIn.js';
import { mapStyles } from './mapStyles.js';
import { mapControls } from './mapControls.js';

const markers = {};

Template.map.onCreated(function() {
	const self = this;
	self.autorun(function() {
		self.subscribe('orders',
			select.getSelectorFromParams(orders.orderFilterFields),
			select.getModifierFromParams()
		);
	});
	GoogleMaps.load({ key: Meteor.settings.public.googleAPIkey,	v: '3.exp' });
	GoogleMaps.ready('deliveryMap', (map) => {
		// console.log("All map tiles have been loaded!");
		orders.orderCollection.find(
			select.getSelectorFromParams(orders.orderFilterFields),
			_.pick(select.getModifierFromParams(), 'sort')
		).observe({
			added: doc => {
				if (doc.shipLocation) {
					console.log(doc.orderNo, 'added');
					const marker = new google.maps.Marker({
						draggable: false,
						animation: google.maps.Animation.DROP,
						position: new google.maps.LatLng(doc.shipLocation.lat, doc.shipLocation.lng),
						map: map.instance,
						title: doc.orderNo+doc.productCode+' '+doc.shipAddress.join(', '),
						label: doc.productCode[1]+'',
						id: doc._id,		// for later reference
					});
					// Store this marker instance within the markers object.
					markers[doc._id] = marker;
				}
			}, 
			changed: (docNew, docOld) => {
				if (markers[docNew._id] && docNew.shipLocation) {
					console.log(docNew.orderNo, 'changed');
					markers[docNew._id].setPosition({ lat: docNew.shipLocation.lat, lng: docNew.shipLocation.lng });
				}
			},
			removed: docOld => {
				if (markers[docOld._id]) {
					console.log(docOld.orderNo, 'removed');
					// Remove the marker from the map
					markers[docOld._id].setMap(null);
					// Remove the reference to this marker instance
					delete markers[docOld._id];
				}
			}
		});


	});	
});

Template.map.onRendered(function() {

});

Template.map.helpers({
	isSignedIn: () => isSignedIn(),
	deliveryMapOptions: function() {
		// Make sure the maps API has loaded
		if (GoogleMaps.loaded() && Template.instance().subscriptionsReady()) {
			console.log('GoogleMaps loaded');
			// Map initialization options
			return {
				center: new google.maps.LatLng(-33.8674365,150.9160425),
				zoom: 11,
				styles: mapStyles,
				use_slippy: true,
				...mapControls,
			}
		} else {
			console.log('GoogleMaps not loaded');
		}

	}

});

Template.map.events({
	'click .js-blank'(event, instance) {
		const id = event.currentTarget.dataset.id;
		const blanks = Template.instance().blanks.get();
		blanks[id] = !blanks[id];
		Template.instance().blanks.set(blanks);
	},
});


