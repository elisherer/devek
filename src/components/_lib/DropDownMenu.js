import React, { useRef, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

const UnsortedList = styled.ul`
  padding: 0;
  display: ${({ open }) => open ? 'block' : 'none'};
  margin: 4px 0;
  border: 1px solid #ccc;
  position: absolute;
  z-index: 9999999;
  background: white;
  max-height: 33vh;
  overflow-y: scroll;
  li {
    list-style: none;
    line-height: 26px;
  }
  label {
    display: inline-block;
    padding: 8px;
    cursor: pointer;
    color: ${({ theme }) => theme.foregroundColor}
    margin-bottom: 0 !important;
    &:active, &:hover {
      color: white;
      background-color: #1e90ff; //Highlight
    }
  }
`;

const DropDownMenu = ({ menu, disabled, children, ...props } : { menu: Array, disabled?: boolean, children?: any }) => {
  const ref = useRef();
  const [ open, setOpen ] = useState(false);
  const handleTriggerClick = useCallback(() => setOpen(!open), [open]);

  const handleKeyDown = useCallback(e => {
    if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
    }
  }, []);
  const handleClickOutside = useCallback(e => {
    if (!ref.current.contains(e.target)) setOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return; // no need for listener
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const isOpen = !disabled && open;

  return (
    <span ref={ref} {...props} aria-haspopup="true" aria-expanded={isOpen} onClick={!disabled ? handleTriggerClick : undefined}>
      {children}
      <UnsortedList open={isOpen} onClick={handleTriggerClick} onChange={handleTriggerClick}>
        {menu && menu.map(({ id, ...props}, i) => <li key={id || i} {...props} />)}
      </UnsortedList>
    </span>
  );
};

export default DropDownMenu;