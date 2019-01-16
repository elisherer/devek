import { h } from 'hyperapp';
import cc from 'classcat';
import styles from "./TextArea.less";
import AutoFocus from "../helpers/autofocus";
import stripFormattingOnPaste from "../helpers/stripFormattingOnPaste";

export default ({ autofocus, className, style, onChange, readonly, value, html }) => (
  <section style={style} className={cc([className, styles.textarea, { [styles.readonly]: readonly }])}>
    <pre contentEditable={!readonly}
         oncreate={autofocus ? AutoFocus : undefined}
         oninput={onChange}
         onpaste={html ? undefined : stripFormattingOnPaste}
         {...{ [html ? "innerHTML" : "innerText"]: value }}
    />
  </section>
);