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
