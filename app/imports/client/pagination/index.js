import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { i18n } from '/imports/lib/i18n.js';
import './pagination.widget.html';

const DEFAULT_NUM_BUTTONS = 7;

Template.pagination.onCreated(function () {
	this.autorun(() => {
		const data = Template.currentData();
		check(data.pages, Number);
		check(data.buttons, Match.Optional(Number));
		if (!data.buttons) data.buttons = DEFAULT_NUM_BUTTONS;
	});
});

Template.pagination.helpers({
	isPrevDisabled() {
		const curPage = parseInt(FlowRouter.getQueryParam('p') || '1');
		return (curPage > 1) ? undefined : 'uk-disabled';
	},
	isNextDisabled() {
		const curPage = parseInt(FlowRouter.getQueryParam('p') || '1');
		const pages = parseInt(Template.currentData().pages);
		return (curPage < pages) ? undefined : 'uk-disabled';
	},
	pageButtons() {
		function clamp(low, val, high) {
			if (!val) return low;
			return Math.min(high, Math.max(low, parseInt(val)));
		}
		const pages = clamp(1, Template.currentData().pages, Infinity);
		const reqNumButtons = clamp(1, Template.currentData().buttons, 30);
		const curPage = clamp(1, FlowRouter.getQueryParam('p'), pages);
		const range = { left: curPage, right: curPage };
		for (let i = 1; i < reqNumButtons; i++) {
			if (i % 2 === 1) {		// expand to right if possible
				if (range.right < pages) range.right++
				else range.left = Math.max(1, range.left - 1);
			}
			if (i % 2 === 0) {		// expand to left if possible
				if (range.left > 1) range.left--
				else range.right = Math.min(pages, range.right + 1);
			}
		}
		const actNumButtons = range.right - range.left + 1;
		return _.range(range.left, range.right + 1).map((p, i) => {
			const btn = { label: p, pageNo: p };
			if (p === curPage) btn.isActive = 'uk-active';
			if (reqNumButtons === 1) btn.label = i18n`Page ${p}`;
			if (actNumButtons >= 3) {	// first and last buttons match first and last page
				if (i === 0) 				{ btn.label = 1; btn.pageNo = 1; }
				if (i === actNumButtons-1) 	{ btn.label = pages; btn.pageNo = pages; };
			}
			if (actNumButtons >= 5) {	// second and second last buttons may be elipses
				const isEnoughRoom = !(range.left !== 1 && range.right !== pages && actNumButtons === 5);
				const isDotsLeft = (range.left !== 1 && isEnoughRoom && i === 1);
				const isDotsRight = (range.right !== pages && isEnoughRoom && i === actNumButtons-2);
				if (isDotsLeft) { btn.label = '...'; btn.isDisabled = 'uk-disabled'; }
				if (isDotsRight) { btn.label = '...'; btn.isDisabled = 'uk-disabled'; }
			}
			return btn;
		});
	},
});

Template.pagination.events({
	'click .js-page'(event) {
		const newPage = event.currentTarget.dataset.page;	// from data-page='xxx'
		if (newPage.match(/\d+/)) FlowRouter.setQueryParams({ p: newPage });
	},
	'click .js-next'(event) {
		const curPage = parseInt(FlowRouter.getQueryParam('p') || '1');
		const pages = parseInt(Template.currentData().pages);
		const newPage = Math.min(curPage + 1, pages);
		FlowRouter.setQueryParams({ p: newPage });
	},
	'click .js-prev'(event) {
		const curPage = parseInt(FlowRouter.getQueryParam('p') || '1');
		const newPage = Math.max(1, curPage - 1);
		FlowRouter.setQueryParams({ p: newPage });
	},
});

export default undefined;
