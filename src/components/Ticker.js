import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTicker } from 'src/redux/selectors';
import { TICKER_PROPS } from 'src/redux/model';


const IMAGE_SCR = 'https://www.bitfinex.com/assets/' +
  'BTC-alt-1ca8728fcf2bc179dfe11f9a0126bc303bee888bff8132c5ff96a4873cf9f0fb.svg';

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
        <img src={IMAGE_SCR} className="ticker-icon" alt="ticker" />
        Ticker:
        <div>{ticker ? JSON.stringify(ticker) : null}</div>
      </div>
    );
  }
});

