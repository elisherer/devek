import React from 'react';
import styles from "./Home.less";

import logo from '../assets/devek_text.svg';

const Home = () => (
  <div className={styles.page}>
    <img alt="Logo" src={logo} />
    <p>
      <strong>Helping tools for developers</strong><br />
      <strong>Everything</strong> is done on the client side,<br/>
      your information is <strong>safe</strong>!<br/>
    </p>

    <p>Press <kbd>/</kbd> for quick search</p>

    <footer className="emoji"><strong>Developed & Hosted</strong> with ❤ by <a href="https://github.com/elisherer">elisherer</a></footer>
  </div>
);

export default Home;