import React, { useEffect, useRef } from 'react';
import devek from 'devek';
import cx from 'classnames';
import styles from "./TextArea.less";

import screen from "helpers/screen";

const blurOnEscape = e => {
  if (e.key === "Escape") {
    e.target.blur();
    e.preventDefault();
  }
};

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

const TextArea = ({ autoFocus, className, style, onChange, readOnly, value, html, disabled, lineNumbers, ...more } :
                    { autoFocus?: boolean, className?: string, style?: Object, onChange?: Function, readOnly?: boolean, value?: string, html?: boolean, disabled?: boolean, lineNumbers?: boolean }) => {
  const innerProp = html ? "innerHTML" : "innerText";

  const inputElement = useRef();

  if (readOnly) {
    if (html) more.dangerouslySetInnerHTML = { __html: value };
    else {
      more.children = value;
    }
  }

  let lineNumbersDiv = false;
  if (lineNumbers && readOnly && !html) {
    const numberOfLines = devek.numberOfLines(value.endsWith('\n') ? value.slice(0,-1) : value);
    lineNumbersDiv = (
      <div className={styles.ln}>
        {Array.from({ length: numberOfLines }).map((x,k)=>k+1).join('\n')}
      </div>
    );
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
    <div className={styles.wrapper}>
      {lineNumbersDiv}
      <pre ref={inputElement} style={style} className={cx(className, styles.textarea, {
        //[styles.has_ln]: lineNumbers,
        [styles.readonly]: readOnly,
        [styles.disabled]: disabled,
      })}
           contentEditable={!readOnly && !disabled}
           onInput={onChange}
           onKeyDown={blurOnEscape}
           onPaste={html ? undefined : stripFormattingOnPaste}
           {...more}
      />
    </div>
  );
};

export default TextArea;