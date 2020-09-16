const getProgramInfo = (gl, program) => ({
	program,
	attribLocations: {
		vertexPosition: gl.getAttribLocation(program, "aVertexPosition"),
		vertexNormal: gl.getAttribLocation(program, "aVertexNormal"),
		textureCoordinates: gl.getAttribLocation(program, "aTextureCoord")
	},
	uniformLocations: {
		projectionMatrix: gl.getUniformLocation(program, "uProjectionMatrix"),
		modelViewMatrix: gl.getUniformLocation(program, "uModelViewMatrix"),
		normalMatrix: gl.getUniformLocation(program, "uNormalMatrix"),
		uSampler: gl.getUniformLocation(program, "uSampler")
	}
});

export default getProgramInfo;
