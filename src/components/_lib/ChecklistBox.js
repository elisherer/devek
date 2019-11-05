import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import ListBox from './ListBox';
import Checkbox from './Checkbox';
import styles from './ChecklistBox.less';

const ChecklistBox = ({ options, label, maxShowSelection, disabled, value, onChange, ...props } : { options: Array, label: string, maxShowSelection?: number, disabled?: boolean, value?: Array, onChange?: Function }) => {
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

  const memoLabel = useMemo(() => maxShowSelection
    ? [value.length ? (maxShowSelection < Infinity ? value.slice(0, maxShowSelection) + (value.length > maxShowSelection ? ' (+' + (value.length - maxShowSelection) + ')' : ''): value.join(',') ) : label]
    : [label]
  , maxShowSelection ? [label, value] : [label]);

  const handleChange = useCallback(e => {
    const newValue = value.includes(e.target.value) ? value.filter(x => x !== e.target.value) : value.concat([e.target.value]);
    onChange(newValue);
  }, [onChange, value]);

  return (
    <label ref={ref} className={styles.checklist} {...props} aria-haspopup="true" aria-expanded={open}>
      <div>
        <ListBox options={memoLabel} size={1} hidePopup onClick={handleTriggerClick} disabled={disabled}/>
      </div>
      <ul className={styles.items + (open ? ' ' + styles.open : '')}>
        {options && options.map(x => {
          const localValue = Object.prototype.hasOwnProperty.call(x, 'value') ? x.value : x;
          return (
            <li key={localValue}>
              <Checkbox label={x.name || localValue}
                        value={localValue}
                        checked={value.includes(localValue)}
                        onChange={handleChange}/>
            </li>
          );
        })}
      </ul>
    </label>
  );
};

export default ChecklistBox;