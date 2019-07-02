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
    title: 'Hash',
    Component: CryptoHash,
  },
  {
    path: 'cipher',
    title: 'Cipher',
    Component: CryptoCipher,
  },
  {
    path: 'generate',
    title: 'Generate Keys',
    Component: CryptoGenerate,
  },
  {
    path: 'cert',
    title: 'Certificate parser',
    Component: CryptoCert,
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
  const subPage = subPages.find(s => s.path === type);
  return <subPage.Component tabs={tabs} {...state[type]} />;
};

export default PageCrypto;