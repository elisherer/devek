export const getJSONAsync = url => new Promise((resolve, reject) => {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      const status = xhr.status;
      if (Math.floor(status / 100) === 2) {
        resolve(xhr.response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.send();
  }
  catch (ex) {
    reject(ex);
  }
});