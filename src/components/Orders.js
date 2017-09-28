import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getAsks, getBids } from 'src/redux/selectors';
import { ORDER, ORDER_PROPS } from 'src/redux/model';


function mapStateToProps(state) {
  return {
    asks: getAsks(state),
    bids: getBids(state),
  };
}

export default connect(mapStateToProps)(class extends React.PureComponent {
  static propTypes = {
    asks: PropTypes.arrayOf(PropTypes.shape(ORDER_PROPS)).isRequired,
    bids: PropTypes.arrayOf(PropTypes.shape(ORDER_PROPS)).isRequired,
  };

  render() {
    const { asks, bids } = this.props;
    const renderOrder = (order => <div key={order[ORDER.PRICE]}>{JSON.stringify(order)}</div>);
    return (
      <div>
        Bids:
        {bids.map(order => renderOrder(order))}
        Asks:
        {asks.map(order => renderOrder(order))}
      </div>
    );
  }
});

