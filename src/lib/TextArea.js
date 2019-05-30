import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import styles from "./TextArea.less";
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

const TextArea = ({ autoFocus, className, style, onChange, readOnly, value, html, ...more } :
                    { autoFocus?: boolean, className?: string, style?: Object, onChange?: Function, readOnly?: boolean, value?: string, html?: boolean }) => {
  const innerProp = html ? "innerHTML" : "innerText";

  const inputElement = useRef();

  if (readOnly) {
    if (html) more.dangerouslySetInnerHTML = { __html: value };
    else more.children = value;
  }

  useEffect(() => {
    if (autoFocus && screen.isDesktop) {
      if (readOnly) {
        inputElement.current.focus();
      } else {
        inputElement.current[innerProp] = value;
        inputElement.current.focus();
        replaceCaret(inputElement.current);
      }
    } else if (!readOnly) {
      inputElement.current[innerProp] = value;
    }
  }, []);

  return (
    <pre ref={inputElement} style={style} className={cx(className, styles.textarea, {[styles.readonly]: readOnly})}
         contentEditable={!readOnly}
         onInput={onChange}
         onPaste={html ? undefined : stripFormattingOnPaste}
         {...more}
    />
  );
};

export default TextArea;