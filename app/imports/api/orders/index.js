import { orderCollection } from './model.js';
import { orderFilterFields, orderSpec } from './model.js';
import { update } from './update.js';
import { startup } from './startup.js';
import { isFetched } from './isFetched.js';

startup();

export const orders = { update, isFetched, orderSpec, orderFilterFields, orderCollection };
