import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';

const appElement = document.getElementById("root");

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('SW registered: ', registration))
      .catch(registrationError => console.error('SW registration failed: ', registrationError));
  });
}

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , appElement);