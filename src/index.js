import React from 'react';
import { render } from 'react-dom';

// ID of the DOM element to mount app on
const ROOT_ELEMENT_ID = 'root-container';

const root = document.getElementById(ROOT_ELEMENT_ID);
const content = (
  <div>
    TODO
  </div>
);
render(content, root);
