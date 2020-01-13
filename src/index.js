import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import App from './components/App';

const appElement = document.getElementById("root");

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // refresh when a new version exists
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    // register service worker
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('SW registered: ', registration))
      .catch(registrationError => console.error('SW registration failed: ', registrationError));
  });
}

render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
  , appElement);