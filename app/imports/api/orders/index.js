import { orderCollection } from './model.js';
import { orderFilterFields } from './model.js';
import { update } from './update.js';
import { startup } from './startup.js';
import { isFetched } from './isFetched.js';

startup();

export const orders = { update, isFetched, orderFilterFields, orderCollection };
