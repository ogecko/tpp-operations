import SimpleSchema 		from 'simpl-schema';
import { parse } from '/imports/lib/parse';
import { orderCollection } from './model.js';
import { getDeliveries } from './getDeliveries.js';

const BulkSchema = new SimpleSchema({
    orderRef: 			{ type:String, min: 3 },
    rcvName: 		    { type:String, optional: true },
    rcvPhone: 		    { type:String, optional: true },
    rcvAddress:         { type:String, optional: true },
    rcvSpecial: 		{ type:String, optional: true },
    deliveryDate: 		{ type:String, optional: true },
    cardTo:      		{ type:String, optional: true },
    cardFrom: 	    	{ type:String, optional: true },
    cardMessage: 		{ type:String, optional: true },
    notes:       		{ type:String, optional: true },
});


export function updateBulkOrder(fileName, fileContents) {
    const lines = fileContents.split('\n', 1);
    if (!/Order_Ref,Recipient_Name,Recipient_Phone,Delivery_Address,Additional_Delivery_Info,Delivery_Date,Card_To,Card_From,Card_Message/.test(lines[0]))
        return 'Invalid import file header format';
    
    const result =  parse.csv(fileContents, BulkSchema, ',', true);
    let msg = '';
    
    result.data.forEach( (spec, i) => {
        console.log('spec',spec);
        if (_.isString(spec.orderRef)&&/^SO[.0-9]+/.test(spec.orderRef)) {
            const specOrderNo = Number(spec.orderRef.slice(2));     // remove the SO prefix
            const masterOrderNo = Math.floor(specOrderNo);
            const newOrderNo = (specOrderNo!=masterOrderNo) ? specOrderNo : specOrderNo + (i+1) * 0.01;
            // try and find any existing order matching it
            const doc = orderCollection.findOne({ orderNo: masterOrderNo });
            if (doc) {
                if (spec.notes=='delete') {
                    msg += `, delete ${newOrderNo}`;
                    orderCollection.remove({ orderNo: newOrderNo });
                } else {
                    msg += `, ${newOrderNo}`;
                    doc.orderNo = newOrderNo;
                    if (spec.rcvName)       { doc.deliveryName = spec.rcvName; doc.shipAddress[0] = spec.rcvName; }
                    if (spec.rcvPhone)      doc.deliveryPhone = spec.rcvPhone;
                    if (spec.rcvAddress)    doc.shipAddress[1] = spec.rcvAddress;
                    if (spec.rcvSpecial)    doc.shipInstructions = spec.rcvSpecial;
                    if (spec.cardTo)        doc.deliveryTo = spec.cardTo;
                    if (spec.cardFrom)      doc.deliveryFrom = spec.cardFrom;
                    if (spec.cardMessage)   doc.specialMessage = spec.cardMessage;
                    if (spec.deliveryDate)	{ doc.deliveryDate = spec.deliveryDate; doc.deliveries = getDeliveries(spec.deliveryDate) };
        
                    console.log('new',doc);
                    orderCollection.upsert({ orderNo: newOrderNo }, { $set: { ...doc, _isModified: '0' }});
                    if (spec.rcvAddress)    Meteor.call('locate order', Number(newOrderNo));
                }
            }
        }
    });

    return `Imported ${result.data.length} rows${msg}.`;
}