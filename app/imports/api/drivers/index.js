const driverCollection = [
	{ seq: 1, name: 'Driver 1', color: '#ff424c' },		// red
	{ seq: 2, name: 'Driver 2', color: '#f47021' },		// orange
	{ seq: 3, name: 'Driver 3', color: '#48a63a' },		// green
	{ seq: 4, name: 'Driver 4', color: '#985236' },		// brown
	{ seq: 5, name: 'Driver 5', color: '#a746ab' },		// purple
	{ seq: 6, name: 'Driver 6', color: '#ffba22' },		// yellow
	{ seq: 7, name: 'Driver 7', color: '#3483de' },		// blue
];

export const drivers = {
	driverCollection,	
	color: (driver) => {
		const d = _.filter(driverCollection, d => (d.name == driver));
		return (d.length===0) ? '#222' : d[0].color;

	}
}