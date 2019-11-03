import React from 'react';
import cx from 'classnames';
import styles from './ListBox.less';

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
                   ...more
                 } : {
  className?: string,
  size?: Number,
  options: Array,
  readOnly?: boolean,
  value: string,
  disabled?: boolean,
  numbered?: boolean,
  indexed?: boolean
}) => {

  return (
    <section className={cx(className, styles.listbox, { [styles.readonly]: readOnly, [styles.disabled]: disabled })}>
      <select readOnly={readOnly}
            size={size || 3}
            value={value}
            onKeyDown={blurOnEscape}
            disabled={disabled}
            {...more}
      >
        {options.map((x, i) => (
          <option key={x.value || (indexed ? i : x)} value={x.value || (indexed ? i : x)}>
            {numbered ? (i+1) + ' - ' : ''}{x.name || x.value || x}
          </option>
        ))}
      </select>
    </section>
  );
};

export default ListBox;
