import { TRADES, TICKER, ORDER_ASKS, ORDER_BIDS } from './constants';

export const getTrades = state => state[TRADES];
export const getTicker = state => state[TICKER];
export const getBids = state => state[ORDER_BIDS];
export const getAsks = state => state[ORDER_ASKS];
