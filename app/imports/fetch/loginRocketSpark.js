import { Meteor } from 'meteor/meteor'

export function loginRocketSpark(url) {
	const email = Meteor.settings.email;
	const password = Meteor.settings.password;
	return function(n) {
		n.goto('https://tpp.rocketsparkau.com'+url)
		.wait(200)
		.insert('#email', email)
		.insert('#password', password)
		.click('#login-inc > div.rs_submit_row > div > input');
	}
}

