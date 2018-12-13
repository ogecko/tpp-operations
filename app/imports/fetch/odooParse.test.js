/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { odooParseLines, odooParseOrder }	from './odooParse.js';

function testParseOdooLine(name, qty) {
    return odooParseLines( [ { display_name: name, name, qty } ]);
}

describe('fetch/parseOdoo.js Unit tests', () => {
	it('should pass a test', () => {
		true.should.equal(true);
    });
    
	it('should sucessfully parse Daily Posy (Small) ', () => {
        const result = testParseOdooLine('Daily Posy (Small)', 3);
        result.should.equal('-PdaySm3');
    });

    it('should sucessfully parse Daily Posy (Medium) ', () => {
        const result = testParseOdooLine('Daily Posy (Medium)', 3);
        result.should.equal('-PdayMd3');
    });

    it('should sucessfully parse Daily Posy (Standard Gift Card, Medium)', () => {
        const result = testParseOdooLine('Daily Posy (Standard Gift Card, Medium)', 1);
        result.should.equal('-PdayMd1');
    });

	it('should sucessfully parse Daily Posy (Large) ', () => {
        const result = testParseOdooLine('Daily Posy (Large)', 1);
        result.should.equal('-PdayLg1');
    });

	it('should sucessfully parse Daily Posy (Extra Large) ', () => {
        const result = testParseOdooLine('Daily Posy (Extra Large)', 1);
        result.should.equal('-PdayXl1');
    });

	it('should sucessfully parse Bright Posy (Medium) ', () => {
        const result = testParseOdooLine('Bright Posy (Medium)', 1);
        result.should.equal('-PbrtMd1');
    });

    it('should sucessfully parse Bright Posy (Small) ', () => {
        const result = testParseOdooLine('Bright Posy (Small)', 2);
        result.should.equal('-PbrtSm2');
    });

	it('should sucessfully parse Sunflower Posy (Medium) ', () => {
        const result = testParseOdooLine('Sunflower Posy (Medium)', 1);
        result.should.equal('-PsunMd1');
    });

	it('should sucessfully parse Native Posy (Medium) ', () => {
        const result = testParseOdooLine('Native Posy (Medium)', 1);
        result.should.equal('-PnatMd1');
    });

	it('should sucessfully parse White & Green Posy (Medium)', () => {
        const result = testParseOdooLine('White & Green Posy (Medium)', 1);
        result.should.equal('-PwgnMd1');
    });

	it('should sucessfully parse Christmas Posy (No, A Christmas Greeting Card, Extra Large)', () => {
        const result = testParseOdooLine('Christmas Posy (No, A Christmas Greeting Card, Extra Large)', 1);
        result.should.equal('-PxmsXl-CardXmas1');
    });

    it('should sucessfully parse Christmas Posy (No, Standard Gift Card, Small)', () => {
        const result = testParseOdooLine('Christmas Posy (No, Standard Gift Card, Small)', 1);
        result.should.equal('-PxmsSm1');
    });

    it('should sucessfully parse Pre-Order Posy (Medium, Daily Posy)', () => {
        const result = testParseOdooLine('Pre-Order Posy (Medium, Daily Posy)', 1);
        result.should.equal('-PpreMd-Pday1');
    });

	it('should sucessfully parse Balmoral Candle (Medium, Wild Peony) ', () => {
        const result = testParseOdooLine('Balmoral Candle (Medium, Wild Peony)', 1);
        result.should.equal('-CndlMdWp1');
    });
	
	it('should sucessfully parse Balmoral Candle (Small, Champagne & Strawberries) ', () => {
        const result = testParseOdooLine('Balmoral Candle (Small, Champagne & Strawberries)', 1);
        result.should.equal('-CndlSmCs1');
    });
	
	it('should sucessfully parse Chocolates (Medium)', () => {
        const result = testParseOdooLine('Chocolates (Medium)', 1);
        result.should.equal('-ChocMd1');
    });
	
	it('should sucessfully parse Chocolates (Small)', () => {
        const result = testParseOdooLine('Chocolates (Small)', 10);
        result.should.equal('-ChocSm10');
    });

    it('should sucessfully parse Botanical Greeting Card', () => {
        const result = testParseOdooLine('Botanical Greeting Card', 2);
        result.should.equal('-CardBtnc2');
    });
    
	it('should sucessfully parse Reed Diffuser (Champagne & Strawberries)', () => {
        const result = testParseOdooLine('Reed Diffuser (Champagne & Strawberries)', 2);
        result.should.equal('-DiffCs2');
    });
  
	it('should sucessfully parse Christmas Posy (White - Malborough Sauvignon Blanc 2017, A Christmas Greeting Card, Medium)', () => {
        const result = testParseOdooLine('Christmas Posy (White - Malborough Sauvignon Blanc 2017, A Christmas Greeting Card, Medium)', 2);
        result.should.equal('-PxmsMd-WineWht-CardXmas2');
    });
  

	it('should parse a complete order', () => {
        const result = odooParseOrder({
            "snd":{"phone":"0434799708","name":"David Morrison","email":"jdmorriso@gmail.com"},
            "card":{"to":"Mum","message":"Break a leg! :) sorry I\'m not there to cheer you on, and missing you heaps xx","from":"Dave"},
            "delivery":{"start":"2018-08-24","freq":"Daily","days":"24-Aug-2018, 27-Aug-2018, 28-Aug-2018","number":3,"subscription":true },
            "rcv":{
                "name":"Mary Morrison","longitude":"","phone":"","address":"Westmead Hospital, Darcy Road, Westmead NSW, Australia","latitude":"","email":"","special":"Leave in Room 321"},
            "write_date":"2018-08-30 02:25:20",
            "date_order":"2018-08-16 11:48:20",
            "id":"SO019",
            "state":"sale",
            "amount_tax": 21.41,
            "lines":[
                {"display_name":"Daily Posy (Medium)","name":"Daily Posy","qty":3},
                {"display_name":"Chocolates (Small)","name":"Chocolates","qty":3},
                {"display_name":"$10 Delivery","name":"$10 Delivery","qty":3},
                {"display_name":"Additional Delivery Charge","name":"Additional Delivery Charge","qty":3}
            ]}
        );
        result.productCode.should.equal('-PdayMd3-ChocSm3');
        result.orderNo.should.equal(19);
        result.customerName.should.equal('David Morrison');
        result.deliveryFrom.should.equal('Dave');
    });

});