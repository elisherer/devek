import React from 'react';
import styled from 'styled-components';

const copyFrom = e => {
  let el = document.getElementById(e.target.dataset.from);
  let ta;
  if (el.nodeName === 'PRE') {
    ta = e.target.firstChild;
    ta.value = el.textContent || '\0';
    el = ta;
  }
  el.select();
  document.execCommand("copy", false, null);
  if (ta) {
    ta.value = '';
  }
};

const Wrapper = styled.span`
  display: inline-block;
  padding: 2px 3px;
  font-size: 12px;
  background: #eee;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 4px;

  &:hover {
    background: #ddd;
  }
  textarea {
    position: absolute;
    left: -100%;
  }
  span + & {
    margin-left: 20px;
  }
`;

const CopyToClipboard = ({ from } : { from: string }) => (
  <Wrapper data-from={from} onClick={copyFrom}>
    <textarea />
    Copy
  </Wrapper>
);

export default CopyToClipboard;