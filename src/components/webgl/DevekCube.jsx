import { useRef, useEffect } from "react";

import { initShaderProgram } from "./shader";
import vsSource from "./shaders/vertex.shader";
import fsSource from "./shaders/fragment.shader";
import getProgramInfo from "./shaders/program_info";

import initBuffers from "./buffers";
import initTextures from "./textures";

import cubeScene from "./cubeScene";
import { parsers } from "../color/color";
import { withTheme } from "styled-components";

const DevekCube = ({ theme } /*: { theme: Object }*/) => {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return; // No WebGL support

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = getProgramInfo(gl, shaderProgram);

    const buffers = initBuffers(gl);
    const textures = initTextures(gl);

    let then = 0,
      stop = false;

    function render(now) {
      if (stop) return;
      now *= 0.001;
      const deltaTime = now - then;
      then = now;

      cubeScene(gl, programInfo, buffers, textures, deltaTime, parsers.hex(theme.cardBackground));

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    return () => (stop = true);
  }, [theme.cardBackground]);

  return <canvas ref={ref} width="150" height="150" />;
};

export default withTheme(DevekCube);
