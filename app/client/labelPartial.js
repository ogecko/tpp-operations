import { Template } from 'meteor/templating';
import { jobQueue } from '/imports/api/jobQueue';
import { orders } from '/imports/api/orders';
import { select } from '/imports/lib/select';
import { ReactiveVar } from 'meteor/reactive-var';

Template.labelPartial.onCreated(function() {
  this.blanks = new ReactiveVar(0);
  this.blanks.set([false,false,false,false,false,false,false,false,false]);
});

Template.labelPartial.helpers({
	isBlank: (id) => 'uk-position-absolute js-blank uk-transform-center '+(Template.instance().blanks.get()[id] ? 'uk-background-default' : 'uk-blend-overlay'),
	numLabels: () => _.reduce(Template.instance().blanks.get(), (memo, b)=>(memo += (b ? 0 : 1)), 0),
	blankParam: () => _.reduce(Template.instance().blanks.get(), (memo, b)=>(memo += (b ? '1' :'0')), ''),
});

Template.labelPartial.events({
	'click .js-blank'(event, instance) {
		const id = event.currentTarget.dataset.id;
		const blanks = Template.instance().blanks.get();
		blanks[id] = !blanks[id];
		Template.instance().blanks.set(blanks);
	},
});

