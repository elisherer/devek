import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import ListBox from "./ListBox";
import Checkbox from "./Checkbox";
import styled from "styled-components";

const Checklist = styled.label`
  position: relative;
  max-width: 560px;
  label {
    margin: 0 !important;
  }
  margin-bottom: 10px;
`;

const Ul = styled.ul`
  padding: 2px;
  display: ${({ open }) => (open ? "block" : "none")};
  margin: 0;
  border: 1px solid ${({ theme }) => theme.greyBorder};
  border-top: ${({ inline, theme }) => (inline ? "1px solid " + theme.greyBorder : "none")};
  position: ${({ inline }) => (inline ? "static" : "absolute")};
  z-index: 9999999;
  background: ${({ theme }) => theme.inputBackground};
  width: 100%;
  max-height: 33vh;
  overflow-y: scroll;
  li {
    list-style: none;
    line-height: 26px;
  }
  label {
    display: inline-block;
    cursor: pointer;
    width: 100%;
    &:active,
    &:hover {
      color: white;
      background-color: ${({ theme }) => theme.highlight};
    }
  }
`;

const ChecklistBox = ({
  options,
  inline,
  label,
  maxShowSelection,
  disabled,
  value,
  onChange,
  ...props
}: {
  options: Array,
  inline?: Boolean,
  label: string,
  maxShowSelection?: number,
  disabled?: boolean,
  value?: Array,
  onChange?: Function
}) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);
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
    if (inline) return;
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inline]);

  useEffect(() => {
    if (inline || !open) return; // no need for listener
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, inline]);

  const memoLabel = useMemo(
    () => {
      if (!maxShowSelection || !value || !value.length) return [label]; // placeholder
      const mappedValue = value.map(x => {
        const found = options.find(
          opt => (Object.prototype.hasOwnProperty.call(opt, "value") ? opt.value : opt) == x
        );
        return Object.prototype.hasOwnProperty.call(found, "name") ? found.name : found;
      });
      if (maxShowSelection < Infinity) {
        return [
          mappedValue.slice(0, maxShowSelection) +
            (value.length > maxShowSelection ? " (+" + (value.length - maxShowSelection) + ")" : "")
        ];
      }
      return [mappedValue.join(",")];
    },
    maxShowSelection ? [label, options, value] : [label]
  );

  const handleChange = useCallback(
    e => {
      const availableValues =
        value && options.map(x => (Object.prototype.hasOwnProperty.call(x, "value") ? x.value : x));
      const valueExists = value.some(x => x == e.target.value);
      const newValue =
        value &&
        availableValues.filter(opt =>
          valueExists
            ? value.some(x => x == opt) && opt != e.target.value
            : value.some(x => x == opt) || opt == e.target.value
        );
      const event = {
        target: {
          value: newValue,
          dataset: ref.current.dataset
        }
      };
      onChange && onChange(event);
    },
    [onChange, value, options]
  );

  const ul = (
    <Ul open={inline || open} inline={inline}>
      {options &&
        options.map(x => {
          const localValue = Object.prototype.hasOwnProperty.call(x, "value") ? x.value : x;
          return (
            <li key={localValue}>
              <Checkbox
                label={x.name || localValue}
                value={localValue}
                checked={value && value.some(x => x == localValue)}
                onChange={handleChange}
              />
            </li>
          );
        })}
    </Ul>
  );

  return (
    <Checklist ref={ref} {...props} aria-haspopup="true" aria-expanded={open}>
      {!inline && (
        <div>
          <ListBox
            options={memoLabel}
            size={1}
            hidePopup
            onClick={handleTriggerClick}
            disabled={disabled}
          />
        </div>
      )}
      {ul}
    </Checklist>
  );
};

export default ChecklistBox;
