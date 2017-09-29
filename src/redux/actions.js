import * as types from 'src/redux/actionTypes';

export function setTrades(trades) {
  return {
    type: types.SET_TRADES,
    trades,
  };
}

export function addTrade(trade) {
  return {
    type: types.ADD_TRADE,
    trade,
  };
}

export function updateTicker(ticker) {
  return {
    type: types.UPDATE_TICKER,
    ticker,
  };
}

export function setOrders(orders) {
  return {
    type: types.SET_ORDERS,
    orders,
  };
}

export function updateOrder(order) {
  return {
    type: types.UPDATE_ORDER,
    order,
  };
}

export function setWsState(wsState) {
  return {
    type: types.SET_WS_STATE,
    wsState,
  };
}

export function setUpdateFrequency(frequency) {
  return {
    type: types.SET_UPDATE_FREQUENCY,
    frequency,
  };
}

export function setUpdatePrecision(precision) {
  return {
    type: types.SET_UPDATE_PRECISION,
    precision,
  };
}
