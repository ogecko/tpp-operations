/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { parseOdooLines, parseOdooOrder }	from './parseOdoo.js';

function testParseOdooLine(name, qty) {
    return parseOdooLines( [ { display_name: name, name, qty } ]);
}

describe('fetch/parseOdoo.js Unit tests', () => {
	it('should pass a test', () => {
		true.should.equal(true);
    });
    
	it('should sucessfully parse Daily Posy (Small) ', () => {
        const result = testParseOdooLine('Daily Posy (Small)', 3);
        result.should.equal('-PDS3');
    });

    it('should sucessfully parse Daily Posy (Medium) ', () => {
        const result = testParseOdooLine('Daily Posy (Medium)', 3);
        result.should.equal('-PDM3');
    });

	it('should sucessfully parse Daily Posy (Large) ', () => {
        const result = testParseOdooLine('Daily Posy (Large)', 1);
        result.should.equal('-PDL1');
    });

	it('should sucessfully parse Daily Posy (Extra Large) ', () => {
        const result = testParseOdooLine('Daily Posy (Extra Large)', 1);
        result.should.equal('-PDX1');
    });

	it('should sucessfully parse Bright Posy (Medium) ', () => {
        const result = testParseOdooLine('Bright Posy (Medium)', 1);
        result.should.equal('-PBM1');
    });

    it('should sucessfully parse Bright Posy (Small) ', () => {
        const result = testParseOdooLine('Bright Posy (Small)', 2);
        result.should.equal('-PBS2');
    });

	it('should sucessfully parse Sunflower Posy (Medium) ', () => {
        const result = testParseOdooLine('Sunflower Posy (Medium)', 1);
        result.should.equal('-PFM1');
    });

	it('should sucessfully parse Native Posy (Medium) ', () => {
        const result = testParseOdooLine('Native Posy (Medium)', 1);
        result.should.equal('-PNM1');
    });

	it('should sucessfully parse White & Green Posy (Medium)', () => {
        const result = testParseOdooLine('White & Green Posy (Medium)', 1);
        result.should.equal('-PWM1');
    });

	it('should sucessfully parse Balmoral Candle (Medium, Wild Peony) ', () => {
        const result = testParseOdooLine('Balmoral Candle (Medium, Wild Peony)', 1);
        result.should.equal('-BMWP1');
    });
	
	it('should sucessfully parse Balmoral Candle (Small, Champagne & Strawberries) ', () => {
        const result = testParseOdooLine('Balmoral Candle (Small, Champagne & Strawberries)', 1);
        result.should.equal('-BSCS1');
    });
	
	it('should sucessfully parse Chocolates (Medium)', () => {
        const result = testParseOdooLine('Chocolates (Medium)', 1);
        result.should.equal('-CM1');
    });
	
	it('should sucessfully parse Chocolates (Small)', () => {
        const result = testParseOdooLine('Chocolates (Small)', 10);
        result.should.equal('-CS10');
    });

    it('should sucessfully parse Greeting Card', () => {
        const result = testParseOdooLine('Greeting Card', 2);
        result.should.equal('-G2');
    });
    
	it('should sucessfully parse Reed Diffuser (Champagne & Strawberries)', () => {
        const result = testParseOdooLine('Reed Diffuser (Champagne & Strawberries)', 2);
        result.should.equal('-DCS2');
    });
    
	it('should parse a complete order', () => {
        const result = parseOdooOrder({
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
        result.productCode.should.equal('-PDM3-CS3');
        JSON.stringify(result).should.equal('{"orderNo":100019,"orderDate":"2018-08-30 02:25:20","customerName":"David Morrison","customerEmail":"jdmorriso@gmail.com","customerPhone":"0434799708","productCode":"-PDM3-CS3","deliveryDate":"24-Aug-2018, 27-Aug-2018, 28-Aug-2018","deliveryName":"Mary Morrison","shipAddress":["Westmead Hospital, Darcy Road, Westmead NSW, Australia"],"shipLocation":{"lat":"","lng":"","geoAddr":"Westmead Hospital, Darcy Road, Westmead NSW, Australia"},"shipInstructions":"Leave in Room 321","deliveryTo":"Mum","specialMessage":"Break a leg! :) sorry I\'m not there to cheer you on, and missing you heaps xx","deliveryFrom":"Dave"}')
    });

});