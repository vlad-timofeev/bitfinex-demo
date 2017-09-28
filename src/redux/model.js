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
