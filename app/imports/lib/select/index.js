import { _getScopeFromDefns } from './getScopeFromDefns.js';
import { _getSelectorFromParams } from './getSelectorFromParams.js';
import { _getModifierFromParams } from './getModifierFromParams.js';
import { _validateParams } from './validateParams.js';
import { _expandLunr } from './expandLunr.js';
import { DEFAULT_ITEMS_PER_PAGE } from './defaultItemsPerPage.js';

export const select = {
	DEFAULT_ITEMS_PER_PAGE, 
	getScopeFromDefns: (defns) => _getScopeFromDefns(defns),
	getSelectorFromParams: (defns) => _getSelectorFromParams(defns),
	getModifierFromParams: () => _getModifierFromParams(),
	validateParams: (defns, selector, modifier) => _validateParams(defns, selector, modifier),
	expandLunr: (name, selector) => _expandLunr(name, selector),
	// validateParams: (params) => _validateParams(params),
	// getSelector: (params) => _combineSelectors(_getConstraint(params), _getFilter(params)),
	// getModifier: (params) => getModifier(params),
};
