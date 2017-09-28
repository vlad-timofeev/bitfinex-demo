import React from 'react';

import connect from 'src/api/bitfinexApi';

export default class extends React.PureComponent {
  componentWillMount() {
    connect();
  }

  render() {
    return (
      <div>
        TODO
      </div>
    );
  }
}
