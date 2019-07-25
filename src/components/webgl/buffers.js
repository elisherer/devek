const createBuffer = (gl, data) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
};

const createElementArrayBuffer = (gl, data) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
};

const initBuffers = gl => {

  const positionBuffer = createBuffer(gl, [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
  ]);

  const vertexNormalsBuffer = createBuffer(gl, [
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,     // Front
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, // Back
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,     // Top
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, // Bottom
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,     // Right
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, // Left
  ]);

  const textureCoordinatesBuffer = createBuffer(gl, [
    0, 1, 1, 1, 1, 0, 0, 0, // Front
    1, 1, 1, 0, 0, 0, 0, 1, // Back
    0, 0, 0, 1, 1, 1, 1, 0, // Top
    1, 0, 0, 0, 0, 1, 1, 1, // Bottom
    1, 1, 1, 0, 0, 0, 0, 1, // Right
    0, 1, 1, 1, 1, 0, 0, 0, // Left
  ]);

  const indexBuffer = createElementArrayBuffer(gl, [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ]);

  return {
    position: positionBuffer,
    normal: vertexNormalsBuffer,
    textureCoordinates: textureCoordinatesBuffer,
    indices: indexBuffer,
  };
};

export default initBuffers;