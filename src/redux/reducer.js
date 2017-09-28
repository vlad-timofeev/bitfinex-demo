import { TRADES, TICKER } from './constants';
import * as types from './actionTypes';

const initialState = {
  [TRADES]: [],
  [TICKER]: null,
};

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
    default:
      return state;
  }
}
