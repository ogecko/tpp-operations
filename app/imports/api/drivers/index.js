const driverCollection = [
	{ seq: 1, name: 'Driver 1', color: '#ff424c' },
	{ seq: 2, name: 'Driver 2', color: '#ff8d49' },
	{ seq: 3, name: 'Driver 3', color: '#94d28b' },
	{ seq: 4, name: 'Driver 4', color: '#b47359' },
	{ seq: 5, name: 'Driver 5', color: '#cb88ce' },
	{ seq: 6, name: 'Driver 6', color: '#ffcb5b' },
	{ seq: 7, name: 'Driver 7', color: '#5997df' },
];

export const drivers = {
	driverCollection,	
	color: (driver) => {
		const d = _.filter(driverCollection, d => (d.name == driver));
		return (d.length===0) ? '#222' : d[0].color;

	}
}