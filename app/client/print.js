Template.print.onRendered(function() {
	const self = this;
	Meteor.setTimeout(() => { 
		window.print(); 
		window.close() 
	}, 1000);
});
