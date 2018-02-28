import { orderCollection } from './model.js';

export function	getNewOrderNo(top=Infinity) {
	const doc = orderCollection.findOne({ orderNo: { $lt: top }}, { sort: { orderNo: -1 } });
	const bottom = doc ? doc.orderNo : Infinity;
	if (top==Infinity && bottom==Infinity) return 1000;		// cannot find any docs so start at 1000
	if (top==Infinity) return getNewOrderNo(bottom);		// now we have a max, keep looking below it
	if (top!=Infinity && bottom==Infinity) return top -1;	// no records below the top, so return top-1
	if (top-bottom<=1) return getNewOrderNo(bottom);		// no room between top and bottom, keep looking below it
	return top - 1;
}
