const initTextures = gl => {

  const logo = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, logo);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([85, 0, 170, 255]));
  // Turn off mips and set wrapping to clamp to edge so it will work regardless of the dimensions of the image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  const img = new Image();
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, logo);
    gl.texImage2D(gl.TEXTURE_2D, /*level*/0, /*internalFormat*/gl.RGBA, /*srcFormat*/gl.RGBA, /*srcType*/gl.UNSIGNED_BYTE, img);
  };
  img.src = '/favicon/apple-icon.png';

  return {
    logo
  };
};

export default initTextures;