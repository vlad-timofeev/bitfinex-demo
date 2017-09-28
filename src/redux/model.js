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
