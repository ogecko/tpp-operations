import { DDP } from 'meteor/ddp-client';

export function createClient() {
	return DDP.connect(process.env.ROOT_URL);
}
