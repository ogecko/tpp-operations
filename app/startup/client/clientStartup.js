import { Meteor } from 'meteor/meteor';
import 'uikit/dist/css/uikit.css';
import 'uikit/dist/js/uikit.min.js';
import '/imports/client/pagination';
import { Template } from 'meteor/templating';
import WebFont from 'webfontloader';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { jobQueue } from '/imports/api/jobQueue';
import SimpleSchema from 'simpl-schema';

// display the template in the content section of the appLayout dynamic template
function appRenderContent(template) {
	BlazeLayout.render('appLayout', { content: template });
};


if (Meteor.isClient) {
	console.log('______CLIENT RESTARTED_______ ');

	WebFont.load({
	  google: {
	    families: [
	      'Pacifico:regular,bold',
	      'Lato:regular,bold,italic',
	    ],
	  },
	});

	AutoForm.setDefaultTemplate('uikit');
AutoForm.debug();

	FlowRouter.route('/', 					{ action: ()=>BlazeLayout.render('appLayout', { content: 'orderList' }) });
	FlowRouter.route('/partial',			{ action: ()=>BlazeLayout.render('appLayout', { content: 'labelPartial' }) });
	FlowRouter.route('/jobs',				{ action: ()=>BlazeLayout.render('appLayout', { content: 'jobList' }) });
	FlowRouter.route('/map',				{ action: ()=>BlazeLayout.render('appLayout', { content: 'map' }) });
	FlowRouter.route('/delivery',			{ action: ()=>BlazeLayout.render('printLayout', { content: 'deliverySheet' }) });
	FlowRouter.route('/labels',				{ action: ()=>BlazeLayout.render('printLayout', { content: 'labelSheet' }) });
	FlowRouter.route('/order/:orderNo', 	{ action: ()=>BlazeLayout.render('appLayout', { content: 'orderEdit' }) });
	FlowRouter.route('/page/:pageTitle', 	{ action: ()=>{
		var pageTitle = FlowRouter.getParam('pageTitle');
		if (!Template[pageTitle]) pageTitle='unknown';
		BlazeLayout.render('appLayout', { content: pageTitle });
	}});

	// Setup a request in the background
	console.log('Starting background recurring jobs');
	jobQueue.dispatch('fetch list', { }, { schedule: "every 5 minutes", retries: 15, wait: 10*1000 });
	jobQueue.dispatch('cleanup', { }, { schedule: "every 5 minutes", retries: 3, wait: 10*1000 });

};
