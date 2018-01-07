import { Meteor } from 'meteor/meteor'

export function loginRocketSpark(url) {
	const email = Meteor.settings.email;
	const password = Meteor.settings.password;
	return function(n) {
		n.goto('https://tpp.rocketsparkau.com'+url)
		.wait('#email')
		.insert('#email', email)
		.insert('#password', password)
		.click('#login-inc > div.rs_submit_row > div > input');
	}
}

