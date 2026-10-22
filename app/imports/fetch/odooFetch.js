import { odooLogin }	from './odooLogin.js';
import { odooFetchOrders }	from './odooFetchOrders.js';
import { odooParseOrder } from './odooParse.js'
import { orders } from '/imports/api/orders';

export function odooFetch() {
    new Promise( (resolve, reject) => {
        console.log('odoo Calling odooFetch');
        const s = Meteor.settings;
        const login = odooLogin(s.odooServer, s.odooDb, s.odooUser, s.odooPassword);
        if (login.error) {
            return reject(new Error(`odoo login failed: ${login.error.message}`));
        }
        const results = odooFetchOrders(s.odooServer, login.session_id);
        if (Array.isArray(results)) {
            results.map(odooParseOrder).forEach(orders.update);
            resolve(results.length);
        } else {
            reject(new Error('no results array from Odoo'));
        }
    })
    .then(results => { console.log(`odoo Received (${results} orders)`) })
    .catch(error => { console.log("odoo Error ",error) });
}