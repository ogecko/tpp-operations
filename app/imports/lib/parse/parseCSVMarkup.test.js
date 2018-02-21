/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { _ } from 'meteor/underscore';
import { parse }			from '/imports/lib/parse';

describe('lib/parse csvMarkup.js  tests', () => {
	// tests for csvMarkup

	it('should be able to parse a single row', () => {
		const result = parse.csvMarkup(`
userPoints|90|awardDesc|Silver Medal|wineName|Abel's Tempest 2011 Chardonnay Pinot Noir|
`, '|');
		_.size(result).should.equal(1);
		result[0].userPoints.should.equal('90');
		result[0].awardDesc.should.equal('Silver Medal');
	});


	it('should be able to parse a blank field row', () => {
		const result = parse.csvMarkup(`
userPoints|90|awardDesc||wineName|Abel's Tempest 2011 Chardonnay Pinot Noir|
`, '|');
		_.size(result).should.equal(1);
		result[0].userPoints.should.equal('90');
		result[0].awardDesc.should.equal('');
	});

	it('should be able to parse with a trailing fieldname', () => {
		const result = parse.csvMarkup(`
userPoints|90|awardDesc|Silver Medal|wineName|Abel's Tempest 2011 Chardonnay Pinot Noir|test
`, '|');
		_.size(result).should.equal(1);
		_.size(result[0]).should.equal(3);
		result[0].userPoints.should.equal('90');
		result[0].awardDesc.should.equal('Silver Medal');
		expect(result[0].test).to.not.exist;
	});


	it('should be able to parse with default separator', () => {
		const result = parse.csvMarkup(`
userPoints,90,awardDesc,Silver Medal,wineName,Abel's Tempest 2011 Chardonnay Pinot Noir,test
`);
		_.size(result).should.equal(1);
		_.size(result[0]).should.equal(3);
		result[0].userPoints.should.equal('90');
		result[0].awardDesc.should.equal('Silver Medal');
		expect(result[0].test).to.not.exist;
	});

	it('should be able to parse a document defining awards', () => {
		const result = parse.csvMarkup(`
# Vintage and NV White or Pink (less than 30 months on lees)
## Judges, Tom Carson, Richard Hemming, Melanie Chester
userPoints|90|awardDesc|Silver Medal|wineName|Abel's Tempest 2011 Chardonnay Pinot Noir|
userPoints|84|wineName|Longview Vineyard 2013 W.Wagtail|
userPoints|82|wineName|Wolf Blass Wines 2012 Gold Medal Label Chardonnay Pinot Noir|
userPoints|85|awardDesc|Bronze Medal|wineName|Sidewood Estate 2012 Isabella Rose|
userPoints|84|wineName|Taltarni Vineyards 2011 Tache|
`, '|');
		_.size(result).should.equal(5);
		result[0].userPoints.should.equal('90');
		result[2].userPoints.should.equal('82');
		result[4].userPoints.should.equal('84');
		result[0].awardDesc.should.equal('Silver Medal');
		result[3].awardDesc.should.equal('Bronze Medal');
	});



	it('should be able to parse a document from Kemenys wineDetails', () => {
		const result = parse.csvMarkup(`prod-desc|Alkoomi Semillion Sauvignon Blanc 2015|prod-type|std|price|12.99|price-qty|1|ctn-qty|12|order-unit|each
|add-prod|<img src="images/prod-details/1110095.jpeg" alt="Alkoomi Semillion Sauvignon Blanc 2015" class="prod-image" onclick="Ev.onclickProdBuy($('prod-buy-button'))"></img>
<div class="prod-head-info"><h1 class="prod-desc">Alkoomi Semillion Sauvignon Blanc 2015</h1>
<div class="prod-rating">
<span class="prod-region-msg">Region</span>
<span class="prod-region">Frankland River</span>
<span class="prod-score"><span class="rate-msg">Rating</span> 92/100</span>
<span class="thumbs"><img src="images/icons/thumb.png" class="thumb"></img></span></div>
</div>
|add-price|<div class="prod-price-wrapper">
<div class="prod-price-amount">
<span class="prod-price-dollar">12</span>
<span class="prod-price-cent">99</span>
</div>
<div class="prod-price-rrp">
<span class="rrp-msg">RRP</span><span class="rrp">$15.00</span></div>
<div class="save">SAVE 13%</div>
</div>
|add-notes|<div class="prod-notes">
<h2 class="prod-heading">"has years of potential. Excellent value", James Halliday</h2>
<div class="prod-note">
<p>Mature estate vineyards dispense with the need of the adornment of
partial barrel fermentation, just a deliciously fresh and
dangerously drinkable blend of tropical fruits tempered and
lengthened by the acidity and texture of semillon.  This is made for
current drinking, but has years of potential.  Exceptional value. 
Alcohol: 12.5%.  Date tasted: Sep 2015.  Drink by: 2018.  Price:
$15.  Rating: 92/100. 
</p></div>
<div class="source">James Halliday, Australian Wine Companion</div>
</div>
`, '|');
		_.size(result).should.equal(1);
		result[0]['prod-desc'].should.equal('Alkoomi Semillion Sauvignon Blanc 2015');
		result[0]['price'].should.equal('12.99');
		result[0]['add-prod'].length.should.equal(550);
		result[0]['add-prod'].slice(520).should.equal('b"></img></span></div>\n</div>\n');
		result[0]['add-notes'].length.should.equal(635);
		result[0]['add-notes'].slice(612).should.equal('Companion</div>\n</div>\n');
	});
});
