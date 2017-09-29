import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getAsks, getBids } from 'src/redux/selectors';
import { ORDER, ORDER_PROPS } from 'src/redux/model';
import { renderTable } from 'src/utils/renderingUtils';


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
    const renderOrder = (order => (
      <tr key={order[ORDER.PRICE]} className="blue-row">
        <th>{order[ORDER.PRICE]}</th>
        <th>{order[ORDER.COUNT]}</th>
        <th>{order[ORDER.AMOUNT]}</th>
      </tr>
    ));
    return (
      <div className="orders">
        {renderTable('Bids:', 'Price', 'Count', 'Amount', bids.map(order => renderOrder(order)))}
        {renderTable('Asks:', 'Price', 'Count', 'Amount', asks.map(order => renderOrder(order)))}
      </div>
    );
  }
});

