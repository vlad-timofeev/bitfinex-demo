import { TRADES } from './constants';
import * as types from './actionTypes';

const initialState = {
  [TRADES]: [],
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
    default:
      return state;
  }
}
