import { HTTP } from 'meteor/http'
import { parseOdooOrder } from './parseOdoo.js'

export function fetchOdoo(url, start) {
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
            return { error: { message: 'bad status code', code: result.statusCode }}
        } if (!result.data) {
            return { error: { message: 'no data returned', code: -1 }}
        } if (!result.data.result || !result.data.result.orders) {
            return { error: { message: 'no json result.orders data returned', code: -1 }}
        }
        return result.data.result.orders.map(parseOdooOrder);
    }
}
