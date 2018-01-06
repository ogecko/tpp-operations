/* eslint-env mocha */
import { chai }				from 'meteor/practicalmeteor:chai'; chai.should();
import { isHtml }			from './isHtml.js';

// Simple unit tests for cheerio.js library function
describe('lib/parse isHtml.js Unit tests', () => {
	it('should reject anything but a string', () => {
		isHtml(10).should.equal(false);
	});

	it('should identify simple html quickly', () => {
		isHtml('<body></body>').should.equal(true);
	});

	it('should identify more complex html using regex', () => {
		isHtml(`
			<!DOCTYPE html>
			<html lang="en-US" dir="ltr" class="redesign no-js"  data-ffo-opensanslight=true data-ffo-opensans=true >
			<head prefix="og: http://ogp.me/ns#"></head>
			<body class="logged_in env-production windows vis-public">
				<a href="#start-of-content" tabindex="1" class="accessibility-aid js-skip-to-content">Skip to content</a>
				<div class="header header-logged-in true" role="banner"></div>
			</body>
		`).should.equal(true);
	});
});

