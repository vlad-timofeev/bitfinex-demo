import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTicker } from 'src/redux/selectors';
import { TICKER_PROPS } from 'src/redux/model';


function mapStateToProps(state) {
  return {
    ticker: getTicker(state),
  };
}

export default connect(mapStateToProps)(class extends React.PureComponent {
  static propTypes = {
    ticker: PropTypes.shape(TICKER_PROPS),
  };

  render() {
    const { ticker } = this.props;
    return (
      <div>
        Ticker:
        <div>{ticker ? JSON.stringify(ticker) : null}</div>
      </div>
    );
  }
});

