function stripFormattingOnPaste(e) {
  const cbData = (e.originalEvent && e.originalEvent.clipboardData) || e.clipboardData;
  if (cbData && cbData.getData) {
    e.preventDefault();
    const plainText = cbData.getData('text/plain');
    window.document.execCommand('insertText', false, plainText);
  }
}

export default stripFormattingOnPaste;