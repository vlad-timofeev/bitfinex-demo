import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import WebsocketClient from 'src/components/WebsocketClient';
import Ticker from 'src/components/Ticker';
import Trades from 'src/components/Trades';
import Orders from 'src/components/Orders';

import { setUpdateFrequency, setUpdatePrecision, setWsState } from 'src/redux/actions';
import { getUpdateFrequency, getUpdatePrecision, getWsState, isResubscribingToOrders } from 'src/redux/selectors';
import {
  UPDATE_FREQUENCY, UPDATE_FREQUENCY_PROPS, UPDATE_PRECISION, UPDATE_PRECISION_PROPS, WS_STATE, WS_STATE_PROPS,
} from 'src/redux/model';


function renderButton(onClick, label, disabled) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

function mapStateToProps(state) {
  return {
    wsState: getWsState(state),
    frequency: getUpdateFrequency(state),
    precision: getUpdatePrecision(state),
    isResubscribingToOrders: isResubscribingToOrders(state),
  };
}

export default connect(mapStateToProps)(class extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    wsState: WS_STATE_PROPS,
    frequency: UPDATE_FREQUENCY_PROPS,
    precision: UPDATE_PRECISION_PROPS,
    isResubscribingToOrders: PropTypes.bool,
  };


  constructor(props) {
    super(props);

    this.toggleConnectionButton = this.toggleConnectionButton.bind(this);
    this.toggleOrdersFrequency = this.toggleOrdersFrequency.bind(this);
    this.increasePrecision = this.changePrecision.bind(this, -1);
    this.decreasePrecision = this.changePrecision.bind(this, 1);
  }

  toggleConnectionButton() {
    const { wsState } = this.props;
    if (wsState === WS_STATE.CONNECTED) {
      this.props.dispatch(setWsState(WS_STATE.CLOSING));
    } else {
      this.props.dispatch(setWsState(WS_STATE.CONNECTING));
    }
  }

  toggleOrdersFrequency() {
    const { frequency } = this.props;
    const nextFrequency = (frequency === UPDATE_FREQUENCY.REAL_TIME)
      ? UPDATE_FREQUENCY.THROTTLED : UPDATE_FREQUENCY.REAL_TIME;
    this.props.dispatch(setUpdateFrequency(nextFrequency));
  }

  changePrecision(adjustment) {
    const { precision } = this.props;
    const precisionKeys = Object.keys(UPDATE_PRECISION);
    const currentIndex = precisionKeys.findIndex(index => UPDATE_PRECISION[index] === precision);
    const nextPrecision = precisionKeys[currentIndex + adjustment];
    this.props.dispatch(setUpdatePrecision(nextPrecision));
  }

  render() {
    const { wsState, frequency, precision } = this.props;
    const resubscribing = this.props.isResubscribingToOrders;
    const connectionButtonDisabled = (wsState === WS_STATE.CONNECTING || wsState === WS_STATE.CLOSING);
    let connectionButtonLabel = 'Wait...';
    if (wsState === WS_STATE.NOT_CONNECTED) {
      connectionButtonLabel = 'Connect';
    } else if (wsState === WS_STATE.CONNECTED) {
      connectionButtonLabel = 'Disconnect';
    }

    const throttleButtonLabel = (frequency === UPDATE_FREQUENCY.REAL_TIME) ? 'Throttle' : 'Real-time';
    const increasePrecLabel = 'Increase Precision';
    const decreasePrecLabel = 'Decrease Precision';
    const frequencyString = (frequency === UPDATE_FREQUENCY.REAL_TIME) ? 'real-time' : 'throttled';
    const description = `Precision: ${precision}, frequency: ${frequencyString}`;
    return (
      <div>
        <WebsocketClient />
        {renderButton(this.toggleConnectionButton, connectionButtonLabel, connectionButtonDisabled)}
        {renderButton(this.toggleOrdersFrequency, throttleButtonLabel, resubscribing)}
        {renderButton(this.increasePrecision, increasePrecLabel, precision === UPDATE_PRECISION.P0 || resubscribing)}
        {renderButton(this.decreasePrecision, decreasePrecLabel, precision === UPDATE_PRECISION.P3 || resubscribing)}
        <Ticker />
        <div className="orders-description">{description}</div>
        <div className="tables-container">
          <Orders />
          <Trades />
        </div>
      </div>
    );
  }
});
