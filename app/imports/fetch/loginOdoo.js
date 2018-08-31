import { HTTP } from 'meteor/http'

export function loginOdoo(url, db, login, password) {
    if (Meteor.isServer) {
        const result = HTTP.call('POST', `${url}/web/session/authenticate`, {
            data: {
                jsonrpc: "2.0", 
                method: "call", 
                params: { db, login, password } 
            }
        });

        if (result.statusCode != 200) {
            return { error: { message: 'bad status code', code: result.statusCode }}
        } if (!result.data) {
            return { error: { message: 'no data returned', code: -1 }}
        } if (result.data.error && result.data.error.data.message) {
            return { error: { message: result.data.error.data.message, code: -2 }};
        }
        
        return { session_id: result.data.result.session_id }
    }
}
