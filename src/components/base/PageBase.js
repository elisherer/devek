import React from 'react';
import { CopyToClipboard, TextBox } from '../_lib';
import { Redirect } from 'react-router-dom';

import { useStore, actions } from './PageBase.store';

import styled from 'styled-components';

const pageRoutes = ['numbers', 'text'];

const BaseLabel = styled.span`
  float: right;
  width: 90px;
`;

const Flex = styled.div`
  display: flex;
`;

const NumberTextBox = styled(TextBox)`
  flex-grow: 1;
  max-width: 100%;
`;

const BaseTextBox = styled(TextBox)`
  display: inline-block;
  width: 90px;
`;

const PageBase = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || '')) {
    return <Redirect to={'/' + pathSegments[0] + '/' + pageRoutes[0]} />;
  }

  const state = useStore();

  const { errors } = state;

  if (type === 'text') {
    const { utf8, hex, binary, base64, base64Url } = state;

    return (
      <div>
        <span>UTF8:</span><CopyToClipboard from="base_text_utf8"/>
        <NumberTextBox invalid={errors.utf8} id="base_text_utf8" autoFocus onChange={actions.utf8} value={utf8} />

        <span>Hex:</span><CopyToClipboard from="base_text_hex"/>
        <NumberTextBox invalid={errors.hex} id="base_text_hex" onChange={actions.hex} value={hex}/>

        <span>Binary:</span><CopyToClipboard from="base_text_binary"/>
        <NumberTextBox invalid={errors.binary} id="base_text_binary" onChange={actions.binary} value={binary}/>

        <span>Base64:</span><CopyToClipboard from="base_text_base64"/>
        <NumberTextBox invalid={errors.base64} id="base_text_base64" value={base64} onChange={actions.base64} />

        <span>Base64Url:</span><CopyToClipboard from="base_text_base64url"/>
        <NumberTextBox invalid={errors.base64Url} id="base_text_base64url" value={base64Url} onChange={actions.base64Url} />
      </div>
    );
  }

  const {
    fromBase,
    from,
    toBase,
    to
  } = state;

  return (
    <div>
      <span>From:</span><CopyToClipboard from="base_number_to"/><BaseLabel>Base:</BaseLabel>
      <Flex>
        <NumberTextBox invalid={errors.from} id="base_number_from" autoFocus onChange={actions.from} value={from} />
        <BaseTextBox type="number" onChange={actions.fromBase} value={fromBase} min={2} max={36}/>
      </Flex>

      <span>To:</span><CopyToClipboard from="base_number_to"/><BaseLabel>Base:</BaseLabel>
      <Flex>
        <NumberTextBox invalid={errors.to} id="base_number_to" onChange={actions.to} value={to}/>
        <BaseTextBox type="number" onChange={actions.toBase} value={toBase} min={2} max={36}/>
      </Flex>
    </div>
  );
};

export default PageBase;