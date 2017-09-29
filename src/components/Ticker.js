import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTicker } from 'src/redux/selectors';
import { TICKER, TICKER_PROPS } from 'src/redux/model';


const IMAGE_SCR = 'https://www.bitfinex.com/assets/' +
  'BTC-alt-1ca8728fcf2bc179dfe11f9a0126bc303bee888bff8132c5ff96a4873cf9f0fb.svg';

const NA = 'N/A';

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
    const lastPrice = (ticker) ? ticker[TICKER.LAST_PRICE] : NA;
    const volume = (ticker) ? ticker[TICKER.VOLUME].toFixed(1) : NA;
    const high = (ticker) ? ticker[TICKER.HIGH] : NA;
    const low = (ticker) ? ticker[TICKER.LOW] : NA;

    return (
      <div className="ticker">
        <div>
          <img src={IMAGE_SCR} className="ticker__icon" alt="ticker" />
          <div><b>BTC/USD</b></div>
        </div>
        <div className="ticker__data">
          <div>{`Last price: ${lastPrice}`}</div>
          <div>{`Volume: ${volume}`}</div>
          <div>{`High: ${high}`}</div>
          <div>{`Low: ${low}`}</div>
        </div>
      </div>
    );
  }
});

