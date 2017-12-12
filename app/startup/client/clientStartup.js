import { Meteor } from 'meteor/meteor';
import 'uikit/dist/css/uikit.css';
import 'uikit/dist/js/uikit.min.js';
import '/imports/client/pagination';
import { Template } from 'meteor/templating';
import WebFont from 'webfontloader';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { jobQueue } from '/imports/api/jobQueue';

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

	FlowRouter.route('/', 					{ action: ()=>appRenderContent('home') });
	FlowRouter.route('/select',				{ action: ()=>appRenderContent('orderSelect') });
	FlowRouter.route('/delivery',			{ action: ()=>appRenderContent('deliverySheet') });
	FlowRouter.route('/labels',				{ action: ()=>appRenderContent('labelSheet') });
	FlowRouter.route('/partial',			{ action: ()=>appRenderContent('labelPartial') });
	FlowRouter.route('/jobs',				{ action: ()=>appRenderContent('jobList') });
	FlowRouter.route('/map',				{ action: ()=>appRenderContent('map') });
	FlowRouter.route('/page/:pageTitle', 	{ action: ()=>{
		var pageTitle = FlowRouter.getParam('pageTitle');
		if (!Template[pageTitle]) pageTitle='unknown';
		appRenderContent(pageTitle);
	}});

	// Setup a request in the background
	console.log('Starting background recurring jobs');
	jobQueue.dispatch('fetch list', { }, { schedule: "every 5 minutes", retries: 3, wait: 10*1000 });
	jobQueue.dispatch('cleanup', { }, { schedule: "every 5 minutes", retries: 3, wait: 10*1000 });

};
