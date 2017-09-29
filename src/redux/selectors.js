import {
  CURRENT_UPDATE_FREQUENCY, CURRENT_UPDATE_PRECISION, CURRENT_WS_STATE, ORDER_ASKS, ORDER_BIDS, TICKER, TRADES,
  RESUBSCRIBING_TO_ORDERS,
} from './constants';

export const getTrades = state => state[TRADES];
export const getTicker = state => state[TICKER];
export const getBids = state => state[ORDER_BIDS];
export const getAsks = state => state[ORDER_ASKS];
export const getWsState = state => state[CURRENT_WS_STATE];
export const getUpdateFrequency = state => state[CURRENT_UPDATE_FREQUENCY];
export const getUpdatePrecision = state => state[CURRENT_UPDATE_PRECISION];
export const isResubscribingToOrders = state => state[RESUBSCRIBING_TO_ORDERS];
