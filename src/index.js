import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Root from 'src/components/Root';
import Store from 'src/redux/Store';

// ID of the DOM element to mount app on
const ROOT_ELEMENT_ID = 'root-container';

const store = Store.configure();
render((
  <Provider store={store}>
    <Root />
  </Provider>
), document.getElementById(ROOT_ELEMENT_ID));
