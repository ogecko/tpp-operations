import { odooLogin }	from './odooLogin.js';
import { orders } from '/imports/api/orders';
import { HTTP } from 'meteor/http'

export function odooShip(orderNo, deliveryDate) {
    return new Promise( (resolve, reject) => {
        const s = Meteor.settings;
        const url = s.odooServer;
        const session_id = odooLogin(url, s.odooDb, s.odooUser, s.odooPassword);

        if (Meteor.isServer) {
            const result = HTTP.call('POST', `${url}/web/ordership`, {
                data: {
                    jsonrpc: '2.0', 
                    method: 'call', 
                    params: { 
                        context: { lang: 'en_US', tz: 'Australia/Sydney', uid: 1 }, 
                        order: orderNo,
                        delivery: deliveryDate,
                    }
                }
            }, (error, result) => {
                if (error) {
                    reject(`bad odooShip status code ${error.response.statusCode}`);
                } else {
                    resolve(result.statusCode);
                }
            });
        } else {
            reject('odooShip should be called on server only')
        }
    })
}