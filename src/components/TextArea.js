import { h } from 'hyperapp';
import cc from 'classcat';
import styles from "./TextArea.less";
import AutoFocus from "helpers/autofocus";
import screen from "helpers/screen";

function stripFormattingOnPaste(e) {
  const cbData = (e.originalEvent && e.originalEvent.clipboardData) || e.clipboardData;
  if (cbData && cbData.getData) {
    e.preventDefault();
    const plainText = cbData.getData('text/plain');
    window.document.execCommand('insertText', false, plainText);
  }
}

function findLastTextNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return node;
  let children = node.childNodes;
  for (let i = children.length-1; i>=0; i--) {
    let textNode = findLastTextNode(children[i]);
    if (textNode !== null) return textNode;
  }
  return null;
}

function replaceCaret(el) {
  // Place the caret at the end of the element
  const target = findLastTextNode(el);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(target, target.nodeValue.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    if (el instanceof HTMLElement) el.focus();
  }
}

export default ({ autofocus, className, style, onChange, readonly, value, html }) => {

  const more = {};

  const innerProp = html ? "innerHTML" : "innerText";

  if (readonly) { // gets constant updates
    more[innerProp] = value;
  }
  more.oncreate = autofocus && screen.isDesktop
    ? (readonly ? AutoFocus : el => { el[innerProp] = value; el.focus(); replaceCaret(el); })
    : (readonly ? undefined : el => { el[innerProp] = value; });

  return (
    <pre style={style} className={cc([className, styles.textarea, {[styles.readonly]: readonly}])}
         contentEditable={!readonly}
         oninput={onChange}
         onpaste={html ? undefined : stripFormattingOnPaste}
         {...more}
    />
  );
}