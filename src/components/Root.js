import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import connectWs from 'src/api/bitfinexApi';
import Trades from 'src/components/Trades';
import { addTrade } from 'src/redux/actions';
import { TRADE } from 'src/redux/model';

export default connect()(class extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  componentWillMount() {
    this.setState({
      connected: false,
      ws: null,
    });
  }

  toggle() {
    const { ws, connected } = this.state;

    if (connected) {
      ws.close();
      this.setState({
        connected: false,
        ws: null,
      });
    } else {
      const newWs = connectWs();
      newWs.onmessage = this.onMessage;
      this.setState({
        connected: true,
        ws: newWs,
      });
    }
  }

  onMessage(message) {
    console.log(message);
    const data = JSON.parse(message.data);
    if (Array.isArray(data) && data.length === 3 && data[1] === 'te') {
      const tradeArray = data[2];
      const trade = {
        [TRADE.ID]: tradeArray[0],
        [TRADE.TIMESTAMP]: tradeArray[1],
        [TRADE.AMOUNT]: tradeArray[2],
        [TRADE.PRICE]: tradeArray[3],
      };
      this.props.dispatch(addTrade(trade));
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.toggle}>
          {this.state.connected ? 'Disconnect' : 'Connect'}
        </button>
        <Trades />
      </div>
    );
  }
});
