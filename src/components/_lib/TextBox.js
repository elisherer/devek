import React, { useEffect, useRef } from 'react';
import screen from 'helpers/screen';
import styled from 'styled-components';

const blurOnEscape = e => {
  if (e.key === "Escape") {
    e.target.blur();
    e.preventDefault();
  }
};

const Wrapper = styled.section`
  display: flex;
  background: ${({ theme, readOnly, disabled }) => readOnly || disabled ? theme.inputDisabledBackground : theme.inputBackground};
  border: 1px solid ${({ theme, invalid }) => invalid ? 'red' : theme.greyBorder};
  border-radius: 5px;
  padding: 8px;
  font-family: ${({ theme }) => theme.fontMono};
  margin-bottom: 10px;
  max-width: 560px;
  input{
    background: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.foregroundColor};
    border: none;
    width: 100%;
    font-family: ${({ theme }) => theme.fontMono};
    margin: 0;
    outline: none;
    white-space: normal;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-all;
    &[readonly], &[disabled] {
      background: ${({ theme }) => theme.inputDisabledBackground};
    }
  }
  &:focus-within {
    border-color: ${({ theme, invalid }) => invalid ? 'red' : theme.inputFocusBorder};
  }
`;

const TextBox = ({
                   autoFocus,
                   selectOnFocus,
                   className,
                   inputClassName,
                   style,
                   readOnly,
                   value,
                   placeholder,
                   startAddon,
                   endAddon,
                   invalid,
                   disabled,
                   ...more
                 } : {
  autoFocus?: boolean,
  selectOnFocus?: boolean,
  className?: string,
  inputClassName?: string,
  style?: Object,
  readOnly?: boolean,
  value: string,
  placeholder?: string,
  startAddon?: any,
  endAddon?: any,
  invalid?: boolean,
  disabled?: boolean,
}) => {
  const inputElement = useRef();

  useEffect(() => {
    if (autoFocus && screen.isDesktop) {
      if (selectOnFocus) {
        inputElement.current.select();
        inputElement.current.focus();
      } else {
        inputElement.current.focus();
      }
    }
  }, []);

  return (
    <Wrapper style={style} className={className} readOnly={readOnly} disabled={disabled} invalid={invalid}>
      {startAddon}
      <input ref={inputElement} readOnly={readOnly} placeholder={placeholder}
             className={inputClassName}
             value={value}
             onKeyDown={blurOnEscape}
             disabled={disabled}
             {...more}
      />
      {endAddon}
    </Wrapper>
  );
};

export default TextBox;
