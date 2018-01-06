/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */
import { chai } from 'meteor/practicalmeteor:chai'; const should = chai.should();
import { $ } from 'meteor/jquery';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { stubs }	from 'meteor/practicalmeteor:sinon';
import moment from 'moment';

import { renderTemplate } from '/imports/test/client.test-helpers.js';
import '/imports/client/pagination';

function checkIsActiveIsDisabled(a) {
	let res = '';
	if ($(a).parent().attr('class')) {
		if ($(a).parent().attr('class').includes('uk-active')) res += 'A';
		if ($(a).parent().attr('class').includes('uk-disabled')) res += 'D';
	}
	return res;
}

function checkPagination(el) {
	let btns = '';
	$(el).find('a.js-prev').each((i, a) => {
		btns = btns + '<' + checkIsActiveIsDisabled(a);
	});

	$(el).find('a.js-page').each((i, a) => {
		btns = btns + '|' + $(a).text().trim() + checkIsActiveIsDisabled(a);
	});

	$(el).find('a.js-next').each((i, a) => {
		btns = btns + '|>' + checkIsActiveIsDisabled(a);
	});

	return btns;
}

describe('client/controls/pagination tests', function () {

	afterEach(() => {
		stubs.restoreAll();
	});

	it('renders a single page pagination menu', function () {
		const data = { pages: 1 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|>D');
		});
	});

	it('renders a two page pagination menu with p1 active', function () {
		const data = { pages: 2 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|>');
		});
	});

	it('renders a two page pagination menu with p2 active', function () {
		const data = { pages: 2 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('2');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2A|>D');
		});
	});

	it('renders a three page pagination menu with p2 active', function () {
		const data = { pages: 3 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('2');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2A|3|>');
		});
	});

	it('renders a four page pagination menu with p4 active', function () {
		const data = { pages: 4 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('4');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2|3|4A|>D');
		});
	});

	it('renders a five page pagination menu with p1 active', function () {
		const data = { pages: 5 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|4|5|>');
		});
	});

	it('renders a six page pagination menu with p1 active', function () {
		const data = { pages: 6 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|4|5|6|>');
		});
	});

	it('renders a six page pagination menu with p6 active', function () {
		const data = { pages: 6 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('6');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2|3|4|5|6A|>D');
		});
	});

	it('renders a seven page pagination menu with p1 active', function () {
		const data = { pages: 7 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|4|5|6|7|>');
		});
	});

	it('renders a seven page pagination menu with NO active page defined', function () {
		const data = { pages: 7 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns(undefined);
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|4|5|6|7|>');
		});
	});

	it('renders a seven page pagination menu with out of bounds -ve active page defined', function () {
		const data = { pages: 7 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns(-4);
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|4|5|6|7|>');
		});
	});

	it('renders a seven page pagination menu with out of bounds +ve active page defined', function () {
		const data = { pages: 7 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns(8);
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2|3|4|5|6|7A|>D');
		});
	});

	it('renders a eight page pagination menu with p1 active', function () {
		const data = { pages: 8 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|4|5|...D|8|>');
		});
	});

	it('renders a eight page pagination menu with p2 active', function () {
		const data = { pages: 8 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('2');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2A|3|4|5|...D|8|>');
		});
	});

	it('renders a eight page pagination menu with p4 active', function () {
		const data = { pages: 8 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('4');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2|3|4A|5|...D|8|>');
		});
	});

	it('renders a eight page pagination menu with p5 active', function () {
		const data = { pages: 8 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('5');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|4|5A|6|7|8|>');
		});
	});

	it('renders a eight page pagination menu with p7 active', function () {
		const data = { pages: 8 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('7');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|4|5|6|7A|8|>');
		});
	});

	it('renders a eight page pagination menu with p8 active', function () {
		const data = { pages: 8 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('8');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|4|5|6|7|8A|>D');
		});
	});

	it('renders a twenty five page pagination menu with p1 active', function () {
		const data = { pages: 25 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|4|5|...D|25|>');
		});
	});

	it('renders a twenty five page pagination menu with p4 active', function () {
		const data = { pages: 25 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('4');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|2|3|4A|5|...D|25|>');
		});
	});

	it('renders a twenty five page pagination menu with p5 active', function () {
		const data = { pages: 25 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('5');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|4|5A|6|...D|25|>');
		});
	});

	it('renders a twenty five page pagination menu with p18 active', function () {
		const data = { pages: 25 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('18');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|17|18A|19|...D|25|>');
		});
	});

	it('renders a twenty five page pagination menu with p24 active', function () {
		const data = { pages: 25 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('24');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|21|22|23|24A|25|>');
		});
	});

	it('renders a twenty five page pagination menu with p25 active', function () {
		const data = { pages: 25 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('25');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|21|22|23|24|25A|>D');
		});
	});

	it('renders a twenty five page (5 button) pagination menu with p1 active', function () {
		const data = { pages: 25, buttons: 5 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|3|...D|25|>');
		});
	});

	it('renders a twenty five page (5 button) pagination menu with p15 active', function () {
		const data = { pages: 25, buttons: 5 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('15');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|14|15A|16|25|>');
		});
	});

	it('renders a twenty five page (5 button) pagination menu with p25 active', function () {
		const data = { pages: 25, buttons: 5 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('25');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|23|24|25A|>D');
		});
	});

	it('renders a twenty five page (3 button) pagination menu with p1 active', function () {
		const data = { pages: 25, buttons: 3 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|1A|2|25|>');
		});
	});

	it('renders a twenty five page (3 button) pagination menu with p15 active', function () {
		const data = { pages: 25, buttons: 3 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('15');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|15A|25|>');
		});
	});

	it('renders a twenty five page (3 button) pagination menu with p25 active', function () {
		const data = { pages: 25, buttons: 3 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('25');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|24|25A|>D');
		});
	});

	it('renders a twenty five page (1 button) pagination menu with p1 active', function () {
		const data = { pages: 25, buttons: 1 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('1');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<D|Page 1A|>');
		});
	});

	it('renders a twenty five page (1 button) pagination menu with p15 active', function () {
		const data = { pages: 25, buttons: 1 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('15');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|Page 15A|>');
		});
	});

	it('renders a twenty five page (1 button) pagination menu with p25 active', function () {
		const data = { pages: 25, buttons: 1 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('25');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|Page 25A|>D');
		});
	});

	it('renders a sixty page (11 button) pagination menu with p8 active', function () {
		const data = { pages: 60, buttons: 11 };
		stubs.create('flow', FlowRouter, 'getQueryParam').returns('8');
		renderTemplate('pagination', data, el => {
			checkPagination(el).should.equal('<|1|...D|5|6|7|8A|9|10|11|...D|60|>');
		});
	});

});
