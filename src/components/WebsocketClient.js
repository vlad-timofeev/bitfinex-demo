import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import connectWs from 'src/api/bitfinexApi';
import {
  addTrade, setOrders, setResubscribingToOrders, setTrades, setWsState, updateOrder, updateTicker,
} from 'src/redux/actions';
import { getUpdateFrequency, getUpdatePrecision, getWsState } from 'src/redux/selectors';
import {
  ORDER, TICKER, TRADE, UPDATE_FREQUENCY_PROPS, UPDATE_PRECISION_PROPS, WS_STATE, WS_STATE_PROPS,
} from 'src/redux/model';


function getSubscribeMessage(channel, fields) {
  return ({
    ...fields,
    event: 'subscribe',
    symbol: 'tBTCUSD',
    channel,
  });
}

function mapStateToProps(state) {
  return {
    wsState: getWsState(state),
    frequency: getUpdateFrequency(state),
    precision: getUpdatePrecision(state),
  };
}

export default connect(mapStateToProps)(class extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    wsState: WS_STATE_PROPS,
    frequency: UPDATE_FREQUENCY_PROPS,
    precision: UPDATE_PRECISION_PROPS,
  };

  constructor(props) {
    super(props);

    this.onWsOpen = this.onWsOpen.bind(this);
    this.onWsMessage = this.onWsMessage.bind(this);
    this.onWsClosed = this.onWsClosed.bind(this);
    this.connectWebsocket = this.connectWebsocket.bind(this);
    this.closeWebsocket = this.closeWebsocket.bind(this);
    this.resubscribeToOrders = this.resubscribeToOrders.bind(this);
    this.subscribeToOrders = this.subscribeToOrders.bind(this);
    this.handleTradeEvent = this.handleTradeEvent.bind(this);
    this.handleTickerEvent = this.handleTickerEvent.bind(this);
    this.handleOrderEvent = this.handleOrderEvent.bind(this);
  }

  componentWillMount() {
    this.setState({
      ws: null,
      tradesChannelId: 0,
      bookChannelId: 0,
      tickerChannelId: 0,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wsState !== this.props.wsState) {
      if (nextProps.wsState === WS_STATE.CLOSING) {
        this.closeWebsocket();
      } else if (nextProps.wsState === WS_STATE.CONNECTING) {
        this.connectWebsocket();
      }
    }
    if (nextProps.frequency !== this.props.frequency || nextProps.precision !== this.props.precision) {
      this.resubscribeToOrders();
    }
  }

  componentWillUnmount() {
    if (this.props.wsState === WS_STATE.CONNECTED) {
      this.closeWebsocket();
    }
  }

  connectWebsocket() {
    const newWs = connectWs(this.onWsOpen, this.onWsMessage, this.onWsClosed);
    this.setState({ ws: newWs });
  }

  closeWebsocket() {
    this.state.ws.close();
  }

  resubscribeToOrders() {
    const { bookChannelId } = this.state;
    if (bookChannelId) {
      this.props.dispatch(setResubscribingToOrders(true));
      this.state.ws.send(JSON.stringify({
        event: 'unsubscribe',
        chanId: bookChannelId,
      }));
    }
  }

  subscribeToOrders() {
    this.state.ws.send(JSON.stringify(getSubscribeMessage('book', {
      freq: this.props.frequency,
      prec: this.props.precision,
    })));
  }

  onWsOpen() {
    const { ws } = this.state;
    this.props.dispatch(setWsState(WS_STATE.CONNECTED));

    ws.send(JSON.stringify(getSubscribeMessage('trades')));
    ws.send(JSON.stringify(getSubscribeMessage('ticker')));
    this.subscribeToOrders();
  }

  onWsMessage(message) {
    const data = JSON.parse(message.data);
    const { event } = data;
    if (event === 'subscribed') {
      this.handleSubscribedEvent(data);
    } else if (event === 'unsubscribed') {
      this.subscribeToOrders();
    } else if (Array.isArray(data)) {
      const channelId = data[0];
      const { tradesChannelId, bookChannelId, tickerChannelId } = this.state;
      if (channelId === bookChannelId) {
        this.handleOrderEvent(data);
      } else if (channelId === tickerChannelId) {
        this.handleTickerEvent(data);
      } else if (channelId === tradesChannelId) {
        this.handleTradeEvent(data);
      }
    }
  }

  onWsClosed() {
    this.props.dispatch(setWsState(WS_STATE.NOT_CONNECTED));
    this.setState({
      tradesChannelId: 0,
      bookChannelId: 0,
      tickerChannelId: 0,
    });
  }

  handleSubscribedEvent(data) {
    const { channel, chanId } = data;
    if (channel === 'trades') {
      this.setState({ tradesChannelId: chanId });
    } else if (channel === 'ticker') {
      this.setState({ tickerChannelId: chanId });
    } else if (channel === 'book') {
      this.setState({ bookChannelId: chanId });
      this.props.dispatch(setResubscribingToOrders(false));
    }
  }

  handleTradeEvent(data) {
    const deserializeTrade = (tradeArray => ({
      [TRADE.ID]: tradeArray[0],
      [TRADE.TIMESTAMP]: tradeArray[1],
      [TRADE.AMOUNT]: tradeArray[2],
      [TRADE.PRICE]: tradeArray[3],
    }));
    if (data.length === 3 && data[1] === 'te') {
      // update
      const tradeArray = data[2];
      const trade = deserializeTrade(tradeArray);
      this.props.dispatch(addTrade(trade));
    } else if (data.length === 2 && Array.isArray(data[1])) {
      // snapshot
      const trades = data[1].map(trade => deserializeTrade(trade));
      this.props.dispatch(setTrades(trades));
    }
  }

  handleTickerEvent(data) {
    const deserializeTicker = (tickerArray => ({
      [TICKER.LAST_PRICE]: tickerArray[6],
      [TICKER.VOLUME]: tickerArray[7],
      [TICKER.HIGH]: tickerArray[8],
      [TICKER.LOW]: tickerArray[9],
    }));
    if (data.length === 2 && Array.isArray(data[1])) {
      const ticker = deserializeTicker(data[1]);
      this.props.dispatch(updateTicker(ticker));
    }
  }

  handleOrderEvent(data) {
    const deserializeOrder = (orderArray => ({
      [ORDER.PRICE]: orderArray[0],
      [ORDER.COUNT]: orderArray[1],
      [ORDER.AMOUNT]: orderArray[2],
    }));
    const nestedData = data[1];
    if (Array.isArray(nestedData) && Array.isArray(nestedData[0])) {
      const orders = nestedData.map(order => deserializeOrder(order));
      this.props.dispatch(setOrders(orders));
    } else if (Array.isArray(nestedData)) {
      this.props.dispatch(updateOrder(deserializeOrder(nestedData)));
    }
  }

  render() {
    return null;
  }
});
