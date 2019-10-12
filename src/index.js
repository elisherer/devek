import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

const appElement = document.getElementById("root");

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , appElement);