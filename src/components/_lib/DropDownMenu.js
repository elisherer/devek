import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './DropDownMenu.less';

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
    <span ref={ref} className={styles.trigger_wrap} {...props} aria-haspopup="true" aria-expanded={isOpen} onClick={!disabled ? handleTriggerClick : undefined}>
      {children}
      <ul className={styles.items + (isOpen ? ' ' + styles.open : '')} onClick={handleTriggerClick} onChange={handleTriggerClick}>
        {menu && menu.map(({ id, ...props}, i) => <li key={id || i} {...props} />)}
      </ul>
    </span>
  );
};

export default DropDownMenu;