import { KeyboardEvent, useEffect, useRef } from "react";
import devek from "@/devek";

import screen from "@/helpers/screen";
import styled from "styled-components";

const blurOnEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    (e.target as any).blur();
    e.preventDefault();
  }
};

function stripFormattingOnPaste(e: any) {
  const cbData = (e.originalEvent && e.originalEvent.clipboardData) || e.clipboardData;
  if (cbData && cbData.getData) {
    e.preventDefault();
    const plainText = cbData.getData("text/plain");
    window.document.execCommand("insertText", false, plainText);
  }
}

function findLastTextNode(node: any) {
  if (node.nodeType === Node.TEXT_NODE) return node;
  const children = node.childNodes;
  for (let i = children.length - 1; i >= 0; i--) {
    const textNode: any = findLastTextNode(children[i]);
    if (textNode !== null) return textNode;
  }
  return null;
}

function replaceCaret(el: any) {
  // Place the caret at the end of the element
  const target = findLastTextNode(el);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const range = document.createRange();
    const sel: any = window.getSelection();
    range.setStart(target, target.nodeValue.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    if (el instanceof HTMLElement) el.focus();
  }
}

const Wrapper = styled.div`
  display: flex;
  background: ${(props: any) => {
    const { theme, "data-readonly": readOnly, "data-disabled": disabled } = props;
    return readOnly || disabled ? (theme as any).inputDisabledBackground : (theme as any).inputBackground;
  }};
  border: 1px solid ${({ theme }) => (theme as any).greyBorder};
  border-radius: 5px;
  min-height: 4em;
  max-height: 450px;
  overflow: auto;
  margin-bottom: 10px;
  &:focus-within {
    border-color: ${({ theme }) => (theme as any).inputFocusBorder};
  }
`;

const LineNumbers = styled.div`
  font-family: ${({ theme }) => (theme as any).fontMono};
  white-space: pre;
  padding-top: 8px;
  padding-right: 8px;
  width: 40px; /* line numbers width */
  color: silver;
  text-align: right;
`;

const Pre = styled.pre`
  display: inline-block;
  min-height: 4em;

  margin: 0;
  padding: 8px;
  outline: none;
  width: 100%;
  white-space: pre; /* use pre-wrap to wrap words */
`;

const TextArea = ({
  autoFocus,
  className,
  style,
  onChange,
  readOnly,
  value,
  html,
  disabled,
  lineNumbers,
  ...more
}: {
  autoFocus?: boolean;
  className?: string;
  style?: any;
  onChange?: any;
  readOnly?: boolean;
  value?: string;
  html?: boolean;
  disabled?: boolean;
  lineNumbers?: boolean;
}) => {
  const innerProp = html ? "innerHTML" : "innerText";

  const inputElement = useRef<HTMLElement | null>(null);

  if (readOnly) {
    if (html) (more as any).dangerouslySetInnerHTML = { __html: value };
    else {
      (more as any).children = value;
    }
  }

  let lineNumbersDiv: any = false;
  if (lineNumbers && readOnly && !html) {
    const numberOfLines = value ? devek.numberOfLines(value.endsWith("\n") ? value.slice(0, -1) : value) : 0;
    lineNumbersDiv = (
      <LineNumbers>
        {Array.from({ length: numberOfLines })
          .map((x, k) => k + 1)
          .join("\n")}
      </LineNumbers>
    );
  }

  useEffect(() => {
    if (!inputElement.current) return;
    if (autoFocus && screen.isDesktop) {
      if (readOnly) {
        inputElement.current.focus();
      } else {
        (inputElement.current as any)[innerProp] = value;
        inputElement.current.focus();
        replaceCaret(inputElement.current);
      }
    } else if (!readOnly) {
      (inputElement.current as any)[innerProp] = value;
    }
  }, []);

  return (
    <Wrapper className={className} data-readonly={Boolean(readOnly)} data-disabled={disabled}>
      {lineNumbersDiv}
      <Pre
        ref={inputElement as any}
        style={style}
        contentEditable={!readOnly && !disabled}
        onInput={onChange}
        onKeyDown={blurOnEscape}
        onPaste={html ? undefined : stripFormattingOnPaste}
        {...more}
      />
    </Wrapper>
  );
};

export default TextArea;
