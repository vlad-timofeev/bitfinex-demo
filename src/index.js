import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Container from 'src/components/Container';
import Store from 'src/redux/Store';

import 'scss/_all.scss';
// ID of the DOM element to mount app on
const ROOT_ELEMENT_ID = 'root-container';

const store = Store.configure();
render((
  <Provider store={store}>
    <Container />
  </Provider>
), document.getElementById(ROOT_ELEMENT_ID));
