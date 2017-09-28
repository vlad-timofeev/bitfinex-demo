import { createStore } from 'redux';

import RootReducer from './reducer';

export default class Store {
  static configure() {
    return createStore(RootReducer);
  }
}
