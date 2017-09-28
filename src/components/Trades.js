import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTrades } from 'src/redux/selectors';
import { TRADE, TRADE_PROPS } from 'src/redux/model';


function mapStateToProps(state) {
  return {
    trades: getTrades(state),
  };
}

export default connect(mapStateToProps)(class extends React.PureComponent {
  static propTypes = {
    trades: PropTypes.arrayOf(PropTypes.shape(TRADE_PROPS)).isRequired,
  };

  render() {
    const trades = this.props.trades.map(trade => <div key={trade[TRADE.ID]}>{JSON.stringify(trade)}</div>);
    return (
      <div>
        Trades:
        {trades}
      </div>
    );
  }
});

