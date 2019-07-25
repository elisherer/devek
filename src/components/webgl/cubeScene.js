import mat4 from './mat4';

let cubeRotation = 0.0;

export default (gl, programInfo, buffers, textures, deltaTime) => {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to white, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix,
    /*fieldOfView*/45 * Math.PI / 180,   // in radians
    /*aspect*/gl.canvas.clientWidth / gl.canvas.clientHeight,
    /*zNear*/0.1,
    /*zFar*/100.0);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to start drawing the square.
  mat4.translate(modelViewMatrix, modelViewMatrix,
    [0.0, 0.0, -6.0]);  // amount to translate

  mat4.rotate(modelViewMatrix, modelViewMatrix,
    Math.PI/8, [1, 0, 0]);       // axis to rotate around (Z)

  mat4.rotate(modelViewMatrix, modelViewMatrix,
    cubeRotation, [0, 1, 0]);       // axis to rotate around (X)

  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    /*numComponents*/3,
    /*type*/gl.FLOAT,
    /*normalize*/false,
    /*stride*/0,
    /*offset*/0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  // Tell WebGL how to pull out the texture coordinates from
  // the texture coordinate buffer into the textureCoord attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoordinates);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoordinates,
    /*numComponents*/2,
    /*type*/gl.FLOAT,
    /*normalize*/false,
    /*stride*/0,
    /*offset*/0);
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoordinates);

  // Tell WebGL how to pull out the normals from
  // the normal buffer into the vertexNormal attribute.
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    /*numComponents*/3,
    /*type*/gl.FLOAT,
    /*normalize*/false,
    /*stride*/0,
    /*offset*/0);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrix);

  // Specify the texture to map onto the faces.

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures.logo);
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  gl.drawElements(gl.TRIANGLES, /*vertexCount*/36, /*type*/gl.UNSIGNED_SHORT, /*offset*/0);

  cubeRotation += deltaTime;
};