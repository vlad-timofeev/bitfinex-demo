import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import connectWs from 'src/api/bitfinexApi';
import Ticker from 'src/components/Ticker';
import Trades from 'src/components/Trades';
import Orders from 'src/components/Orders';
import { addTrade, setOrders, setTrades, updateOrder, updateTicker } from 'src/redux/actions';
import { ORDER, TICKER, TRADE } from 'src/redux/model';

const WS_STATE = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  CLOSING: 'CLOSING',
};

const ORDERS_UPDATE_FREQUENCY = {
  REAL_TIME: 'F0',
  THROTTLED: 'F1',
};

function getSubscribeMessage(channel, fields) {
  return ({
    ...fields,
    event: 'subscribe',
    symbol: 'tBTCUSD',
    channel,
  });
}

export default connect()(class extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleConnectionButton = this.toggleConnectionButton.bind(this);
    this.toggleOrdersFrequency = this.toggleOrdersFrequency.bind(this);
    this.onWsOpen = this.onWsOpen.bind(this);
    this.onWsMessage = this.onWsMessage.bind(this);
    this.onWsClosed = this.onWsClosed.bind(this);
    this.handleTradeEvent = this.handleTradeEvent.bind(this);
    this.handleTickerEvent = this.handleTickerEvent.bind(this);
    this.handleOrderEvent = this.handleOrderEvent.bind(this);
  }

  componentWillMount() {
    this.setState({
      ws: null,
      wsState: WS_STATE.NOT_CONNECTED,
      tradesChannelId: 0,
      bookChannelId: 0,
      tickerChannelId: 0,
      ordersUpdateFrequency: ORDERS_UPDATE_FREQUENCY.REAL_TIME,
    });
  }

  toggleConnectionButton() {
    const { ws, wsState } = this.state;
    if (wsState === WS_STATE.CONNECTED) {
      ws.close();
      this.setState({ wsState: WS_STATE.CLOSING });
    } else {
      const newWs = connectWs(this.onWsOpen, this.onWsMessage, this.onWsClosed);
      this.setState({
        ws: newWs,
        wsState: WS_STATE.CONNECTING,
      });
    }
  }

  toggleOrdersFrequency() {
    const { ordersUpdateFrequency, bookChannelId } = this.state;
    const nextFrequency = (ordersUpdateFrequency === ORDERS_UPDATE_FREQUENCY.REAL_TIME)
      ? ORDERS_UPDATE_FREQUENCY.THROTTLED : ORDERS_UPDATE_FREQUENCY.REAL_TIME;
    this.setState({ ordersUpdateFrequency: nextFrequency });
    if (bookChannelId) {
      this.state.ws.send(JSON.stringify({
        event: 'unsubscribe',
        chanId: bookChannelId,
      }));
    }
  }

  onWsOpen() {
    this.setState({ wsState: WS_STATE.CONNECTED });
    this.state.ws.send(JSON.stringify(getSubscribeMessage('trades')));
    this.state.ws.send(JSON.stringify(getSubscribeMessage('book', { freq: this.state.ordersUpdateFrequency })));
    this.state.ws.send(JSON.stringify(getSubscribeMessage('ticker')));
  }

  onWsMessage(message) {
    const data = JSON.parse(message.data);
    const { event } = data;
    if (event === 'subscribed') {
      this.handleSubscribedEvent(data);
    } else if (event === 'unsubscribed') {
      this.state.ws.send(JSON.stringify(getSubscribeMessage('book', { freq: this.state.ordersUpdateFrequency })));
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
    this.setState({
      wsState: WS_STATE.NOT_CONNECTED,
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
    let buttonDisabled = true;
    let buttonLabel = 'Wait...';
    if (this.state.wsState === WS_STATE.NOT_CONNECTED) {
      buttonDisabled = false;
      buttonLabel = 'Connect';
    } else if (this.state.wsState === WS_STATE.CONNECTED) {
      buttonDisabled = false;
      buttonLabel = 'Disconnect';
    }
    const throttleButtonLabel = (this.state.ordersUpdateFrequency === ORDERS_UPDATE_FREQUENCY.REAL_TIME)
      ? 'Throttle' : 'Real-time';
    return (
      <div>
        <button onClick={this.toggleConnectionButton} disabled={buttonDisabled}>
          {buttonLabel}
        </button>
        <button onClick={this.toggleOrdersFrequency}>
          {throttleButtonLabel}
        </button>
        <Ticker />
        <Orders />
        <Trades />
      </div>
    );
  }
});
