import PropTypes from 'prop-types';

export const TRADE = {
  ID: 'id',
  TIMESTAMP: 'timestamp',
  AMOUNT: 'amount',
  PRICE: 'price',
};

export const TRADE_PROPS = {
  [TRADE.ID]: PropTypes.number,
  [TRADE.TIMESTAMP]: PropTypes.number,
  [TRADE.AMOUNT]: PropTypes.number,
  [TRADE.PRICE]: PropTypes.number,
};

export const TICKER = {
  LAST_PRICE: 'lastPrice',
  VOLUME: 'volume',
  HIGH: 'high',
  LOW: 'low',
};

export const TICKER_PROPS = {
  [TICKER.LAST_PRICE]: PropTypes.number,
  [TICKER.VOLUME]: PropTypes.number,
  [TICKER.HIGH]: PropTypes.number,
  [TICKER.LOW]: PropTypes.number,
};

export const ORDER = {
  PRICE: 'price',
  COUNT: 'count',
  AMOUNT: 'amount',
};

export const ORDER_PROPS = {
  [ORDER.PRICE]: PropTypes.number,
  [ORDER.COUNT]: PropTypes.number,
  [ORDER.AMOUNT]: PropTypes.number,
};

export const WS_STATE = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  CLOSING: 'CLOSING',
};

export const WS_STATE_PROPS = PropTypes.oneOf(Object.keys(WS_STATE).map(key => WS_STATE[key]));

export const UPDATE_FREQUENCY = {
  REAL_TIME: 'F0',
  THROTTLED: 'F1',
};

export const UPDATE_FREQUENCY_PROPS = PropTypes.oneOf(Object.keys(UPDATE_FREQUENCY).map(key => UPDATE_FREQUENCY[key]));

export const UPDATE_PRECISION = {
  P0: 'P0',
  P1: 'P1',
  P2: 'P2',
  P3: 'P3',
};

export const UPDATE_PRECISION_PROPS = PropTypes.oneOf(Object.keys(UPDATE_PRECISION).map(key => UPDATE_PRECISION[key]));
