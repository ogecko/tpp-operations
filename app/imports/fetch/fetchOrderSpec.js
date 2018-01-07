import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { parse } from '/imports/lib/parse';
import moment from 'moment';

export function match(self, splitAt, re, replace, str) {
	if (self.isSet) return undefined;
	if (!str) return undefined;
	const entries = str.replace(/\n/gm, '<nl>').split(splitAt);
	const result = _.reduce(entries, (memo, s) => {
		return s.match(re) ? memo+s.replace(re, replace) : memo
		}, '' 
	);
	if (!result) return undefined;
	return parse.unescapeHtml(result.replace(/<nl>/gm,' '));
}

export const fetchOrderSpec = new SimpleSchema({
	dom: {
		type: Object, optional: true, blackbox: true,
		autoValue: function(doc) { return parse.domCheck(this); }
	},
	orderNo: {
		type: Number, 
		autoValue: function(doc) { 
			if (this.isSet) return undefined;
			return parse.domSelect(this, String, 'h1 > span.h1-text').replace(/Order #/,''); 
		}
	},
	// rawBilling: {
	// 	type: String, optional: true,
	// 	autoValue: function(doc) { 
	// 		if (this.isSet) return undefined;
	// 		return parse.domSelect(this, 'html', 'td[width="50%"]'); 
	// 	}
	// },
	// rawShipping: {
	// 	type: String, optional: true,
	// 	autoValue: function(doc) { 
	// 		if (this.isSet) return undefined;
	// 		return parse.domSelect(this, 'html', 'td:nth-child(2)[width="50%"]'); 
	// 	}
	// },
	deliveryDate: {
		type: String, optional: true,
		autoValue: function(doc) { 
			return match(this, 'd-block', /.*Date of Posy Delivery .DD.MM.YY.<.strong><br> <span>(.*)<.span><br><.span>.*/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
		}
	},

	deliveryDateChecked: {
		type: Date, optional: true,
		autoValue: function(doc) { 
			if (this.isSet) return undefined;
			const str = match(this, 'd-block', /.*Date of Posy Delivery .DD.MM.YY.<.strong><br> <span>(.*)<.span><br><.span>.*/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
			return parse.dates(str);
		}
	},

	customerEmail: {
		type: String, optional: true,
		autoValue: function(doc) { 
			return match(this, '<br>', /.*Email<.strong> <span>(.*)<.span>/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
		}
	},

	customerPhone: {
		type: String, optional: true,
		autoValue: function(doc) { 
			if (this.isSet) return undefined;
			const str = match(this, '<br>', /.*Phone<.strong> <span>(.*)<.span>/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
			if (!str) return undefined;
			return str.replace(/\./gm, ' ');
		}
	},


	deliveryFrom: {
		type: String, optional: true,
		autoValue: function(doc) { 
			return match(this, 'd-block', /.*From<.strong><br> <span>(.*)<.span><br><.span>.*/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
		}
	},

	deliveryTo: {
		type: String, optional: true,
		autoValue: function(doc) { 
			return match(this, 'd-block', /.*Posy For<.strong><br> <span>(.*)<.span><br><.span>.*/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
		}
	},


	specialMessage: {
		type: String, optional: true,
		autoValue: function(doc) { 
			return match(this, 'd-block', /.*Special Message<.strong><br> <span>((\r|.)*)<.span><br><.span>.*/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
		}
	},


	shipInstructions: {
		type: String, optional: true,
		autoValue: function(doc) { 
			return match(this, '</span>', /.*delivery notes:<.strong> <span>(.*)/, '$1', 
				   parse.domSelect(this, 'html', 'div.left-details'));
		}
	},

	shipAddress: {
		type: [String], optional: true,
		autoValue: function(doc) { 
			if (this.isSet) return undefined;
			const str0 = parse.domSelect(this, 'html', 'div.delivery');
			if (!str0) return [];
			const str4 = str0
							.replace(/<br>/gm, '')
							.replace(/<span>/gm, '')
						    .replace(/<\/span> /gm,'<nl>')
						    .replace(/<\/span>/gm,'')
							.replace(/<strong>Delivery Address<.strong>/gm, '')
							.replace(/<span class=.m-t-25 d-block.><strong>Business Name .optional.<.strong>([a-zA-Z 0-9,.\-:/&']+)<nl>([a-zA-Z 0-9,.\-:/&']+)/gm, '$2<nl>$1')
							.replace(/<\!---->/gm, '')
						    .replace(/Australia/gm, '')					// remove Australia (only shipping to aus)
						    .replace(/(New South Wales|Nsw)/gmi, 'NSW')	// abbreviate State
						    .replace(/Street/gmi, 'St')					// abbreviate Street Type http://meteor.aihw.gov.au/content/index.phtml/itemId/270020
						    .replace(/Road/gmi, 'Rd')
						    .replace(/Avenue/gmi, 'Ave')
						    .replace(/Parade/gmi, 'Pde')
						    .replace(/Place/gmi, 'Pl')
						    .replace(/([a-zA-Z 0-9,.\/]{8,}), ([a-zA-Z 0-9,.\/]{8,})/, '$1<nl>$2')
						    .replace(/<nl>(\d\d\d\d)<nl>([a-zA-Z 0-9,.-]+)<nl>([a-zA-Z ]+)<nl>/gm, '<nl>$2 $3 $1<nl>')
						    .replace(/<nl>([a-zA-Z 0-9,.-]+)<nl>([a-zA-Z]{1,3})<nl>(\d\d\d\d)<nl>/gm, '<nl>$1 $3 $2<nl>')
						    .split('<nl>');
			return _.compact(str4);
		}
	},

	productCode: {
		type: String, optional: true,
		autoValue: function(doc) { 
			if (this.isSet) return undefined;
			const sku = match(this, '', /(.*)/, '$1', 
				parse.domSelect(this, String, '.order-summary-total'));
			const code = (sku2code[sku]) ? sku2code[sku] : '-0-SP';
			// console.log(`sku: ${sku}, code: ${code}`);
			return code;
		}
	},

	amount: {
		type: String, optional: true,
		autoValue: function(doc) { return parse.domSelect(this, Number, '.order-summary-total > span:nth-child(2)'); }
	},
});

	const sku2code = {
		"Total: $29.99": "-S-C0",
		"Total: $45.99": "-S-CS",
		"Total: $55.99": "-S-CL",
		"Total: $44.99": "-M-C0",
		"Total: $60.99": "-M-CS",
		"Total: $70.99": "-M-CL",
		"Total: $69.99": "-L-C0",
		"Total: $85.99": "-L-CS",
		"Total: $95.99": "-L-CL",

		"10002": 		"-S-C0",
		"10002-1": 		"-S-CS",
		"10009": 		"-S-CL",
		"10010": 		"-M-C0",
		"10011": 		"-M-CS",
		"10012": 		"-M-CL",
		"10015": 		"-L-C0",
		"10016": 		"-L-CS",
		"10017": 		"-L-CL",

		"10001-1": 		"-S-C0",
		"10001-2": 		"-S-CS",
		"10001-3": 		"-S-CL",
		"10002-1-2": 	"-M-C0",
		"10002-2": 		"-M-CS",
		"10002-3": 		"-M-CL",
		"10003-1": 		"-L-C0",
		"10003-2": 		"-L-CS",
		"10003-3": 		"-L-CL",

		"10008": 		"-0-CS",
		"10008-1": 		"-0-CL",

		"10004": 		"-R-C0",
		"10004-1": 		"-R-CS",
		"10004-2": 		"-R-CL",
	}
