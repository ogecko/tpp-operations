const driverCollection = [
	{ seq: 1, name: 'Driver 1', color: '#ff424c' },		// red
	{ seq: 2, name: 'Driver 2', color: '#3d29f6' },		// prusian blue
	{ seq: 3, name: 'Driver 3', color: '#f47021' },		// orange
	{ seq: 4, name: 'Driver 4', color: '#48a63a' },		// green
	{ seq: 5, name: 'Driver 5', color: '#985236' },		// brown
	{ seq: 6, name: 'Driver 6', color: '#a746ab' },		// purple
	{ seq: 7, name: 'Driver 7', color: '#ffba22' },		// yellow
	{ seq: 8, name: 'Driver 8', color: '#008dcf' },		// cyan
];

export const drivers = {
	driverCollection,	
	color: (driver) => {
		const d = _.filter(driverCollection, d => (d.name == driver));
		return (d.length===0) ? '#222' : d[0].color;

	}
}