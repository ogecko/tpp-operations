import { HTTP } from 'meteor/http'

export function odooFetchOrders(url, start) {
    if (Meteor.isServer) {
        const result = HTTP.call('POST', `${url}/web/orderjson`, {
            data: {
                jsonrpc: '2.0', 
                method: 'call', 
                params: { 
                    context: { lang: 'en_US', tz: 'Australia/Sydney', uid: 1 }, 
                    limit: 10,
                    start: '2018-08-23'
                }
            }
        });
        // console.log('login response',result);

        if (result.statusCode != 200) {
            return new Error('bad status code');
        } if (!result.data) {
            return new Error('no data returned');
        } if (!result.data.result || !result.data.result.orders) {
            return new Error('no json result.orders data returned');
        }
        return result.data.result.orders;
    }
}
