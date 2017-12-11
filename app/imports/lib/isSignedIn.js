import { Meteor } from 'meteor/meteor';


export function isSignedIn() {
	const user = Meteor.user();
	if (user) {
		const email = user.emails[0].address;
		console.log(email);
		if (email === 'jdmorriso@gmail.com' || 
			email === 'contactus@theposyplace.com.au') {
			return true;
		}
	}
	return undefined;
}
