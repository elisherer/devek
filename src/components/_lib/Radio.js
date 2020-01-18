import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 400px;
  text-align: center;
  margin-bottom: 20px;
  overflow: hidden;

  > * {
    color: ${({ theme }) => theme.foregroundColor};
    text-decoration: none;
    flex-basis: ${({ flexBasis }) => (flexBasis || 50) +'%'};
    font-size: 12px;
    line-height: 2.5em;
    cursor: pointer;
    border-radius: 3px;
    margin-right: 8px;
    margin-bottom: 10px;
    background-color: ${({ theme }) => theme.togglebarInactiveBackground};
    user-select: none;
    &:hover {
      background-color: ${({ theme }) => theme.togglebarHoverBackground};
    }
    &[aria-current], &[data-active] {
      background-color: ${({ theme }) => theme.togglebarBackground};
      color: white;
    }
    &[aria-current]:hover, &[data-active]:hover {
      background-color: ${({ theme }) => theme.togglebarActiveHoverBackground}; 
    }
  }
`;

const Radio = ({ className, children, options, value, onClick, showEmptyWith, flexBasis } :
                 { className?: string, children?: any, options?: Array, value?: any, onClick?: Function, showEmptyWith?: string, flexBasis?: number }) => (
  <Wrapper className={className} flexBasis={flexBasis}>
    {options
      ? options.map(o => (
        (o || showEmptyWith) && <div key={o || showEmptyWith} data-active={value === o || null} data-value={o} onClick={onClick}>{o || showEmptyWith}</div>
      ))
      : children}
  </Wrapper>
);

export default Radio;