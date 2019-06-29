import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from "./TextBox.less";
import screen from 'helpers/screen';

const blurOnEscape = e => {
  if (e.key === "Escape") {
    e.target.blur();
    e.preventDefault();
  }
};

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
    <section style={style} className={cx(className, styles.textbox, { [styles.readonly]: readOnly, [styles.disabled]: disabled, [styles.error]: invalid })}>
      {startAddon}
      <input ref={inputElement} readOnly={readOnly} placeholder={placeholder}
             className={inputClassName}
             value={value}
             onKeyDown={blurOnEscape}
             disabled={disabled}
             {...more}
      />
      {endAddon}
    </section>
  );
};

export default TextBox;
