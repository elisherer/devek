export const getAsync = (url, type = "json") =>
	new Promise((resolve, reject) => {
		try {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.responseType = type;
			xhr.onload = function () {
				const status = xhr.status;
				if (Math.floor(status / 100) === 2) {
					resolve(xhr.response);
				} else {
					reject(xhr.response);
				}
			};
			xhr.send();
		} catch (ex) {
			reject(ex);
		}
	});
