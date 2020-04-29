const driverCollection = [
	{ seq: 01, name: 'Kate',     color: '#2E91E5' },		// blue
	{ seq: 02, name: 'Arvin',    color: '#6C4516' },		// poo
	{ seq: 03, name: 'Mel',      color: '#1CA71C' },		// green
	{ seq: 04, name: 'Phil',     color: '#FB0D0D' },		// red
	{ seq: 05, name: 'Raj', 	 color: '#DA16FF' },		// purple
	{ seq: 06, name: 'Dave',     color: '#B68100' },		// tan
	{ seq: 07, name: 'Joe',      color: '#750D86' },		// deep purple
	{ seq: 08, name: 'Michael',  color: '#EB663B' },		// peach
	{ seq: 09, name: 'Driver 1', color: '#00A08B' },		// cyan
	{ seq: 10, name: 'Driver 2', color: '#FB00D1' },		// pink
	{ seq: 11, name: 'Driver 3', color: '#B2828D' },		// tan
	{ seq: 12, name: 'Driver 4', color: '#6C7C32' },		// green
	{ seq: 13, name: 'Driver 5', color: '#778AAE' },		// grey
	{ seq: 14, name: 'Driver 6', color: '#862A16' },		// brown
	{ seq: 15, name: 'Driver 7', color: '#A777F1' },		// mauve
	{ seq: 16, name: 'Driver 8', color: '#AF0038' },		// red
];

export const drivers = {
	driverCollection,	
	color: (driver) => {
		const d = _.filter(driverCollection, d => (d.name == driver));
		return (d.length===0) ? '#222' : d[0].color;

	}
}