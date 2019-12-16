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

  const memoLabel = useMemo(() => {
    if (!maxShowSelection || !value || !value.length) return [label]; // placeholder
    const mappedValue = value.map(x => {
      const found = options.find(opt => (Object.prototype.hasOwnProperty.call(opt, 'value') ? opt.value : opt) == x);
      return Object.prototype.hasOwnProperty.call(found, 'name') ? found.name : found;
    });
    if (maxShowSelection < Infinity) {
      return [mappedValue.slice(0, maxShowSelection) + 
          (value.length > maxShowSelection ? ' (+' + (value.length - maxShowSelection) + ')' : '')];
    }
    return [mappedValue.join(',')];
  }, maxShowSelection ? [label, options, value] : [label]);

  const handleChange = useCallback(e => {
    const availableValues = value && options.map(x => Object.prototype.hasOwnProperty.call(x, 'value') ? x.value : x);
    const valueExists = value.some(x => x == e.target.value);
    const newValue = value && availableValues.filter(opt => valueExists 
      ? value.some(x => x == opt) && opt != e.target.value
      : value.some(x => x == opt) || opt == e.target.value);
    const event = {
      target: {
        value: newValue,
        dataset: ref.current.dataset
      }
    };
    onChange && onChange(event);
  }, [onChange, value, options]);

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
                        checked={value && value.some(x => x == localValue)}
                        onChange={handleChange}/>
            </li>
          );
        })}
      </ul>
    </label>
  );
};

export default ChecklistBox;