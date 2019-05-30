import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import App from "./components/App";
import { initHistory, getHistory } from "./helpers/history";

const appElement = document.getElementById("root");

const pullHistory = br => {
  if (br && !getHistory()) {
    initHistory(br.history);
  }
};

render(
  <BrowserRouter ref={pullHistory}>
    <App />
  </BrowserRouter>
  , appElement);