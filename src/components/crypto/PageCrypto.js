import React from 'react';
import { Tabs } from '../_lib';
import { Redirect, NavLink } from 'react-router-dom';
import { useStore } from './PageCrypto.store';

import CryptoHash from "./CryptoHash";
import CryptoCert from "./CryptoCert";
import CryptoCipher from "./CryptoCipher";
import CryptoGenerate from "./CryptoGenerate";

const subPages = [
  {
    path: 'hash',
    title: 'Hash'
  },
  {
    path: 'cipher',
    title: 'Cipher'
  },
  {
    path: 'generate',
    title: 'Generate Keys'
  },
  {
    path: 'cert',
    title: 'Certificate parser'
  }
];

const PageCrypto = () => {
  const pathSegments = location.pathname.substr(1).split('/');

  const type = pathSegments[1];
  if (!type || !subPages.find(sp => sp.path === type)) {
    return <Redirect to={`/${pathSegments[0]}/${subPages[0].path}`} />;
  }

  const tabs = (
    <Tabs>
      {subPages.map(subPage => (
        <NavLink key={subPage.path} to={`/${pathSegments[0]}/${subPage.path}`}>{subPage.title}</NavLink>
      ))}
    </Tabs>
  );

  const state = useStore();

  if (type === 'hash') {
    return <CryptoHash tabs={tabs} {...state.hash} />;
  }
  else if (type === 'generate') {
    return <CryptoGenerate tabs={tabs} {...state.generate} />
  }
  else if (type === 'cert') {
    return <CryptoCert tabs={tabs} {...state.cert} />;
  }
  else if (type === 'cipher') {
    return <CryptoCipher tabs={tabs} {...state.cipher} />;
  }
};

export default PageCrypto;