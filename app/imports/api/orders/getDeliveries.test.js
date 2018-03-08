/* eslint-env mocha */
import { chai, expect }	from 'meteor/practicalmeteor:chai'; chai.should();
import { getDeliveries, getIsShippedAll, toggleDeliveryShipment, setDeliveryShipment }	from './getDeliveries.js';


function testGetDeliveries(str) {
	return _.map(getDeliveries(str), JSON.stringify);
}


// Simple unit tests for combine.js library function
describe('orders/getDeliveries.js Unit tests', () => {
	it('should pass a test', () => {
		true.should.equal(true);
	});

	it('should parse a non-string', () => {
		const result = getDeliveries(undefined);
		result.length.should.equal(0);
	});

	it('should parse a simple date', () => {
		const result = testGetDeliveries('1/3/18');
		result.length.should.equal(1);
		result[0].should.equal('{"id":0,"raw":"1/3/18","fmt":"01-Mar-18","date":"2018-02-28T13:00:00.000Z","isShipped":false}');
	});

	it('should parse a simple date in dd-mmm-yy format', () => {
		const result = testGetDeliveries('28-Feb-18');
		result.length.should.equal(1);
		result[0].should.equal('{"id":0,"raw":"28-Feb-18","fmt":"28-Feb-18","date":"2018-02-27T13:00:00.000Z","isShipped":false}');
	});

	it('should parse a simple date in dd-mmm-yyyy format', () => {
		const result = testGetDeliveries('21-Feb-2018');
		result.length.should.equal(1);
		result[0].should.equal('{"id":0,"raw":"21-Feb-2018","fmt":"21-Feb-18","date":"2018-02-20T13:00:00.000Z","isShipped":false}');
	});

	it('should parse a simple date that has been shipped', () => {
		const result = testGetDeliveries('1/3/18X');
		result.length.should.equal(1);
		result[0].should.equal('{"id":0,"raw":"1/3/18X","fmt":"01-Mar-18","date":"2018-02-28T13:00:00.000Z","isShipped":true}');
	});

	it('should parse a simple date that has been shipped, ignoring case', () => {
		const result = testGetDeliveries('1/3/18x');
		result.length.should.equal(1);
		result[0].should.equal('{"id":0,"raw":"1/3/18x","fmt":"01-Mar-18","date":"2018-02-28T13:00:00.000Z","isShipped":true}');
	});

	it('should parse a simple date that has been shipped, ignoring gaps', () => {
		const result = testGetDeliveries('1/3/18 x');
		result.length.should.equal(1);
		result[0].should.equal('{"id":0,"raw":"1/3/18 x","fmt":"01-Mar-18","date":"2018-02-28T13:00:00.000Z","isShipped":true}');
	});

	it('should parse two simple dates', () => {
		const result = testGetDeliveries('1/3/18, 30/4/18');
		result.length.should.equal(2);
		result[0].should.equal('{"id":0,"raw":"1/3/18","fmt":"01-Mar-18","date":"2018-02-28T13:00:00.000Z","isShipped":false}');
		result[1].should.equal('{"id":1,"raw":"30/4/18","fmt":"30-Apr-18","date":"2018-04-29T14:00:00.000Z","isShipped":false}');
	});

	it('should parse three simple dates', () => {
		const result = testGetDeliveries('1/3/18, 30/4/18x, 5/6/18');
		result.length.should.equal(3);
		result[0].should.equal('{"id":0,"raw":"1/3/18","fmt":"01-Mar-18","date":"2018-02-28T13:00:00.000Z","isShipped":false}');
		result[1].should.equal('{"id":1,"raw":"30/4/18x","fmt":"30-Apr-18","date":"2018-04-29T14:00:00.000Z","isShipped":true}');
		result[2].should.equal('{"id":2,"raw":"5/6/18","fmt":"05-Jun-18","date":"2018-06-04T14:00:00.000Z","isShipped":false}');
	});

	it('should parse three simple dates and sort into ascending order', () => {
		const result = testGetDeliveries('5/6/18, 1/3/18, 30/4/18x');
		result.length.should.equal(3);
		result[0].should.equal('{"id":1,"raw":"1/3/18","fmt":"01-Mar-18","date":"2018-02-28T13:00:00.000Z","isShipped":false}');
		result[1].should.equal('{"id":2,"raw":"30/4/18x","fmt":"30-Apr-18","date":"2018-04-29T14:00:00.000Z","isShipped":true}');
		result[2].should.equal('{"id":0,"raw":"5/6/18","fmt":"05-Jun-18","date":"2018-06-04T14:00:00.000Z","isShipped":false}');
	});

	it('should toggle a delivery shipment to shipped', () => {
		toggleDeliveryShipment('1/3/18',0).should.equal('1/3/18x');
	});

	it('should toggle a delivery shipment to unshipped', () => {
		toggleDeliveryShipment('1/3/18 x',0).should.equal('1/3/18');
	});

	it('should toggle a delivery shipment in a set of 3 to unshipped', () => {
		toggleDeliveryShipment('1/3/18, 30/4/18x, 5/6/18',1).should.equal('1/3/18, 30/4/18, 5/6/18');
	});

	it('should toggle a delivery shipment in a set of 3 to shipped (last)', () => {
		toggleDeliveryShipment('1/3/18, 30/4/18x, 5/6/18',2).should.equal('1/3/18, 30/4/18x, 5/6/18x');
	});

	it('should toggle a delivery shipment in a set of 3 to shipped (first)', () => {
		toggleDeliveryShipment('1/3/18, 30/4/18x, 5/6/18',0).should.equal('1/3/18x, 30/4/18x, 5/6/18');
	});

	it('should set the delivery as shipped', () => {
		setDeliveryShipment('1/3/18').should.equal('1/3/18x');
	});

	it('should set the delivery as shipped (when already shipped)', () => {
		setDeliveryShipment('1/3/18x').should.equal('1/3/18x');
	});

	it('should set the second delivery as shipped', () => {
		setDeliveryShipment('1/3/18x, 30/4/18, 5/6/18').should.equal('1/3/18x, 30/4/18x, 5/6/18');
	});

	it('should set the second delivery as shipped, even when out of order', () => {
		setDeliveryShipment('1/3/18x, 5/6/18, 30/4/18').should.equal('1/3/18x, 5/6/18, 30/4/18x');
	});

	it('should get isShippedAll 0 for a no date', () => {
		getIsShippedAll('').should.equal('0');
	});

	it('should get isShippedAll 0 for a single date', () => {
		getIsShippedAll('1/3/18').should.equal('0');
	});

	it('should get isShippedAll 1 for a single date', () => {
		getIsShippedAll('1/3/18x').should.equal('1');
	});

	it('should get isShippedAll 0 for a three dates', () => {
		getIsShippedAll('1/3/18x, 2/3/18, 3/3/18x').should.equal('0');
	});

	it('should get isShippedAll 1 for a three dates', () => {
		getIsShippedAll('1/3/18x, 2/3/18x, 3/3/18x').should.equal('1');
	});

});