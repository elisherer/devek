function loadShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(
			"An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
		); // eslint-disable-line
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

export const initShaderProgram = (gl, vsSource, fsSource) => {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error(
			"Unable to initialize the shader program: " +
				gl.getProgramInfoLog(shaderProgram)
		); // eslint-disable-line
		return null;
	}

	return shaderProgram;
};
