export const loadFileAsync = (file, callback) => {
  if (typeof FileReader === "undefined" || !file) return; // no file
  const reader = new FileReader();
  reader.onload = e => {
    callback(e.target.result);
  };
  reader.onerror = () => {
    reader.abort();
  };
  reader.readAsText(file);
};