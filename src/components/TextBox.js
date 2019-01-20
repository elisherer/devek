import { h } from 'hyperapp';
import cc from 'classcat';
import styles from "./TextBox.less";
import AutoFocus from "../helpers/autofocus";

const AutoFocusWithSelect = e => e.select() || e.focus();

export default ({
  autofocus,
  selectOnFocus,
  className,
  inputClassName,
  style,
  onChange,
  readonly,
  value,
  placeholder,
  startAddon,
  endAddon
}) => (
  <section style={style} className={cc([className, styles.textbox, { [styles.readonly]: readonly }])}>
    {startAddon}
    <input readonly={readonly} placeholder={placeholder}
           className={inputClassName}
           value={value}
           oninput={onChange}
           oncreate={autofocus ? (selectOnFocus ? AutoFocusWithSelect : AutoFocus) : undefined}
    />
    {endAddon}
  </section>
);
