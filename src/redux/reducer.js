import {
  CURRENT_UPDATE_FREQUENCY, CURRENT_UPDATE_PRECISION, CURRENT_WS_STATE, ORDER_ASKS, ORDER_BIDS, TICKER, TRADES,
  RESUBSCRIBING_TO_ORDERS,
} from './constants';
import * as types from './actionTypes';
import { ORDER, UPDATE_FREQUENCY, UPDATE_PRECISION, WS_STATE } from './model';

const initialState = {
  [TRADES]: [],
  [TICKER]: null,
  [ORDER_BIDS]: [],
  [ORDER_ASKS]: [],
  [CURRENT_WS_STATE]: WS_STATE.NOT_CONNECTED,
  [CURRENT_UPDATE_FREQUENCY]: UPDATE_FREQUENCY.REAL_TIME,
  [CURRENT_UPDATE_PRECISION]: UPDATE_PRECISION.P0,
  [RESUBSCRIBING_TO_ORDERS]: false,
};

function sortOrdersByPrice(orders, sign) {
  return orders.sort((a, b) => sign * (a[ORDER.PRICE] - b[ORDER.PRICE]));
}

function splitOrders(orders) {
  const bids = orders.filter(order => order[ORDER.AMOUNT] > 0);
  const asks = orders.filter(order => order[ORDER.AMOUNT] <= 0);
  return {
    [ORDER_BIDS]: sortOrdersByPrice(bids, -1),
    [ORDER_ASKS]: sortOrdersByPrice(asks, 1),
  };
}

function insertOrder(orders, order) {
  const newOrders = orders.filter(item => item[ORDER.PRICE] !== order[ORDER.PRICE]);
  if (order[ORDER.COUNT] > 0) {
    newOrders.push(order);
  }
  return newOrders;
}

function updateOrders(asks, bids, newOrder) {
  const amount = newOrder[ORDER.AMOUNT];
  let newAsks = asks;
  let newBids = bids;

  if (amount > 0) {
    newBids = insertOrder(newBids, newOrder);
  } else {
    newAsks = insertOrder(newAsks, newOrder);
  }

  return {
    [ORDER_BIDS]: sortOrdersByPrice(newBids, -1),
    [ORDER_ASKS]: sortOrdersByPrice(newAsks, 1),
  };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_TRADES:
      return {
        ...state,
        [TRADES]: action.trades,
      };
    case types.ADD_TRADE:
      return {
        ...state,
        [TRADES]: [...state[TRADES], action.trade],
      };
    case types.UPDATE_TICKER:
      return {
        ...state,
        [TICKER]: action.ticker,
      };
    case types.SET_ORDERS:
      return {
        ...state,
        ...splitOrders(action.orders),
      };
    case types.UPDATE_ORDER:
      return {
        ...state,
        ...updateOrders(state[ORDER_ASKS], state[ORDER_BIDS], action.order),
      };
    case types.SET_WS_STATE:
      return {
        ...state,
        [CURRENT_WS_STATE]: action.wsState,
      };
    case types.SET_UPDATE_FREQUENCY:
      return {
        ...state,
        [CURRENT_UPDATE_FREQUENCY]: action.frequency,
      };
    case types.SET_UPDATE_PRECISION:
      return {
        ...state,
        [CURRENT_UPDATE_PRECISION]: action.precision,
      };
    case types.SET_RESUBSCRIBING_TO_ORDERS:
      return {
        ...state,
        [RESUBSCRIBING_TO_ORDERS]: action.resubscribingToOrders,
      };
    default:
      return state;
  }
}
