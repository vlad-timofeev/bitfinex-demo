import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import connectWs from 'src/api/bitfinexApi';
import Ticker from 'src/components/Ticker';
import Trades from 'src/components/Trades';
import { addTrade, setTrades, updateTicker } from 'src/redux/actions';
import { TRADE, TICKER } from 'src/redux/model';

const WS_STATE = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  CLOSING: 'CLOSING',
};

export default connect()(class extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.toggleConnectionButton = this.toggleConnectionButton.bind(this);
    this.onWsOpen = this.onWsOpen.bind(this);
    this.onWsMessage = this.onWsMessage.bind(this);
    this.onWsClosed = this.onWsClosed.bind(this);
    this.handleTradeEvent = this.handleTradeEvent.bind(this);
    this.handleTickerEvent = this.handleTickerEvent.bind(this);
  }

  componentWillMount() {
    this.setState({
      ws: null,
      wsState: WS_STATE.NOT_CONNECTED,
      channelIdHandlerMap: {},
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

  onWsOpen() {
    this.setState({ wsState: WS_STATE.CONNECTED });
    const getSubscribeMessage = (channel => ({
      event: 'subscribe',
      symbol: 'tBTCUSD',
      channel,
    }));
    this.state.ws.send(JSON.stringify(getSubscribeMessage('trades')));
    // ws.send(JSON.stringify(getSubscribeMessage('book')));
    this.state.ws.send(JSON.stringify(getSubscribeMessage('ticker')));
  }

  onWsMessage(message) {
    console.log(message);
    const data = JSON.parse(message.data);
    const { event } = data;
    if (event === 'subscribed') {
      this.handleSubscribedEvent(data);
    } else if (Array.isArray(data) && this.state.channelIdHandlerMap[data[0]]) {
      this.state.channelIdHandlerMap[data[0]](data);
    }
  }

  onWsClosed() {
    this.setState({ wsState: WS_STATE.NOT_CONNECTED });
  }

  handleSubscribedEvent(data) {
    const { channel, chanId } = data;
    let handler;
    if (channel === 'trades') {
      handler = this.handleTradeEvent;
    } else if (channel === 'ticker') {
      handler = this.handleTickerEvent;
    }
    this.setState({
      channelIdHandlerMap: {
        ...this.state.channelIdHandlerMap,
        [chanId]: handler,
      },
    });
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
    return (
      <div>
        <button onClick={this.toggleConnectionButton} disabled={buttonDisabled}>
          {buttonLabel}
        </button>
        <Ticker />
        <Trades />
      </div>
    );
  }
});
