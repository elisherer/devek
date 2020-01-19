import React from 'react';
import styled from 'styled-components';

const Mark = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  height: 20px;
  width: 20px;
  border: 2px solid ${({ theme }) => theme.radioBorder}; 
  border-radius: 20px;

  &:after {
    content: "\\25cf";
    position: absolute;
    display: none;
    left: 2px;
    top: -8px;
    color: ${({ theme }) => theme.secondaryColor};
    font-size: 20px;
  }
`;

const OptionLabel = styled.label`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:focus ~ ${Mark} {
      border-color: ${({ theme }) => theme.secondaryColor};
    }

    &:checked ~ ${Mark}:after {
      display: block;
    }
  }
`;

const RadioOption = ({ label, children, ...props } : { label: string, children: any, id: string }) => (
  <OptionLabel htmlFor={props.id}>
    {children || label}
    <input type="radio" {...props} />
    <Mark />
  </OptionLabel>
);

export default RadioOption;