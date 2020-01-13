import React from 'react';
import styled from 'styled-components'

const Wrapper = styled.label`
  display: flex !important;
  margin-bottom: 10px !important;
  position: relative;
  background: ${({ theme, readOnly, disabled }) => readOnly || disabled ? theme.textareaReadonlyBackground : theme.textareaBackground};
  border: 1px solid ${({ theme }) => theme.greyBorder};
  border-radius: 5px;
  padding: 8px;
  max-width: 560px;
  cursor: pointer;
  select{
    cursor: pointer;
    background: ${({ theme }) => theme.textareaBackground};
    color: ${({ theme }) => theme.foregroundColor};
    border: none;
    width: 100%;
    margin: 0;
    outline: none;
    white-space: normal;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-all;
    &[readonly], &[disabled] {
      background: ${({ theme }) => theme.textareaReadonlyBackground};
    }
  }
  &:focus-within {
    border-color: ${({ theme }) => theme.secondaryColor};
  }
  &.error, &.error:focus-within {
    border-color: red;
  }
`;

const SelectHider = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const blurOnEscape = e => {
  if (e.key === "Escape") {
    e.target.blur();
    e.preventDefault();
  }
};

const ListBox = ({
                   className,
                   size,
                   options,
                   readOnly,
                   value,
                   disabled,
                   numbered,
                   indexed,
                   hidePopup,
                   uid,
                   ...more
                 } : {
  className?: string,
  size?: Number,
  options: Array,
  readOnly?: boolean,
  value: string,
  disabled?: boolean,
  numbered?: boolean,
  indexed?: boolean,
  hidePopup?: boolean,
  uid?: Function,
}) => {

  return (
    <Wrapper className={className}>
      <select readOnly={readOnly}
            size={size || 3}
            value={value}
            onKeyDown={blurOnEscape}
            disabled={disabled}
            {...more}
      >
        {options && options.map((x, i) => (
          <option key={uid ? uid(x) : (x.value || (indexed ? i : x))} value={x.value || (indexed ? i : x)}>
            {numbered ? (i+1) + ' - ' : ''}{x.name || x.value || x}
          </option>
        ))}
      </select>
      {hidePopup &&  (<SelectHider />)}
    </Wrapper>
  );
};

export default ListBox;
