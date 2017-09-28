import React from 'react';
import { render } from 'react-dom';

import Root from 'src/components/Root';

// ID of the DOM element to mount app on
const ROOT_ELEMENT_ID = 'root-container';

render(<Root />, document.getElementById(ROOT_ELEMENT_ID));
