import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';
import { select } from '/imports/lib/select';
import { isSignedIn } from '/imports/lib/isSignedIn.js';
import { mapStyles } from './mapStyles.js';
import { mapControls } from './mapControls.js';
import { drivers } from '/imports/api/drivers';

const markers = {};

function pinSymbol(color) {
    return {
        // path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1 1 10,-30 C 10,-22 2,-20 0,0 z',	// original
        // path: 'M 0,0 C -2,-20 -15,-18 -15,-30 Q -15,-40 -5,-40 L 5,-40 Q 15,-40 15,-30 C 15,-18 2,-20 0,0 z',	// stretched original
        path: 'M 0,0 C -2,-20 -10,-20 -15,-20 L -15,-35 Q -15,-40 -10,-40 L 10,-40 Q 15,-40 15,-35 L 15,-20 C 10,-20 2,-20 0,0 z',	// rounded rect marker
        fillColor: color,
        fillOpacity: .8,
        strokeColor: "#FFF",
        strokeWeight: 0,
        scale: 1,
        labelOrigin: new google.maps.Point(0, -30),
   };
}

function pinLabel(text) {
	return {
		color: '#FFF',
		fontSize: '15px',
		fontWeight: 'bold',
		text: text,
	};
}

const LAT = -33.8674365;
const LNG = 150.9160425;

function poly(map) {
// create an array of coordinates for a pentagonal polygon
        var arrCoords = [
            new google.maps.LatLng(LAT+0.00, LNG+0.00-0.5),
            new google.maps.LatLng(LAT+0.00, LNG+0.02-0.5),
            new google.maps.LatLng(LAT+0.02, LNG+0.02-0.5),
            new google.maps.LatLng(LAT+0.02, LNG+0.00-0.5),
        ];
        
        var polygon = new google.maps.Polygon({
            editable: true,
            draggable: true,
            paths: arrCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.25,
            map: map.instance
        });
}

const mapOrderSelector = { $or: [{ driver: { $exists: true }}, { isSelected: '1' } ] };

Template.map.onCreated(function() {
	const self = this;
	self.autorun(function() {
		self.subscribe('orders',
			mapOrderSelector,
			select.getModifierFromParams()
		);
	});
	GoogleMaps.load({ key: Meteor.settings.public.googleAPIkey,	v: '3.exp' });
	GoogleMaps.ready('deliveryMap', (map) => {
		// console.log("All map tiles have been loaded!");
		// poly(map);
		orders.orderCollection.find(
			mapOrderSelector,
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
						title: doc.driver+': '+doc.orderNo+doc.productCode+' '+doc.shipAddress.join(', '),
						label: pinLabel((doc.orderNo+'').slice(-3)),
						icon: pinSymbol(drivers.color(doc.driver)),
						id: doc._id,		// for later reference
					});
					// Store this marker instance within the markers object.
					markers[doc._id] = marker;
				}
			}, 
			changed: (docNew, docOld) => {
				console.log(docNew.orderNo, 'changed');
				if (markers[docNew._id] && docNew.shipLocation) {
					markers[docNew._id].setPosition({ lat: docNew.shipLocation.lat, lng: docNew.shipLocation.lng });
				}
				if (markers[docNew._id] && docNew.driver) {
					markers[docNew._id].setIcon(pinSymbol(drivers.color(docNew.driver)));
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
				center: new google.maps.LatLng(LAT,LNG),
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


