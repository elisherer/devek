const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

export const loadFileAsync = (file, callback) => {
  if (typeof FileReader === "undefined" || !file || file.type.indexOf("image") === -1) return; // no file or not an image

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const src = img.src;
      callback(canvas.width, canvas.height, src);
    };
    img.src = e.target.result;
  };
  reader.onerror = () => {
    reader.abort();
  };
  reader.readAsDataURL(file);
};

const createFilter = filter => {
  return () => {
    const imageData = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);

    for (let j = 0; j < imageData.width ; j++)
      for (let i = 0; i < imageData.height ; i++)
        filter(imageData.data, (i*4)*imageData.width+(j*4), i, j);

    ctx.putImageData(imageData,0, 0);

    return canvas.toDataURL();
  }
};

export const handleGreyscale = createFilter((data, index) => {
  const grey = 0.2989 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
  data[index]= grey;
  data[index+1]= grey;
  data[index+2]= grey;
});

export const handleSepia = createFilter((data, index) => {
  const r = data[index], g = data[index + 1], b = data[index + 2];
  data[index] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
  data[index + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
  data[index + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
});

export const handleInvert = () => {
  ctx.save();
  ctx.globalCompositeOperation = 'difference';
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  return canvas.toDataURL();
};

export const handleFlip = dir => {
  ctx.save();
  if (dir === 'h' ) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);  
  }
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
  return canvas.toDataURL();
};

export const handleResize = (width, height) => {
  const oc = document.createElement('canvas'),
    octx = oc.getContext('2d');
  oc.width = width;
  oc.height = height;
  octx.drawImage(canvas, 0, 0, width, height);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(oc, 0, 0);
  return canvas.toDataURL();
};

export const handleCrop = crop => {
  let
    x = parseInt(crop.x),
    y = parseInt(crop.y),
    width = parseInt(crop.width),
    height = parseInt(crop.height);

  const oc = document.createElement('canvas'),
    octx = oc.getContext('2d');
  oc.width = width;
  oc.height = height;
  octx.drawImage(canvas, x ,y ,width, height, 0, 0, width, height);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(oc, 0, 0);
  return canvas.toDataURL();
};

export const handleRotate = angle_rad => {
  let w = canvas.width,
    h = canvas.height;

  const oc = document.createElement('canvas'),
    octx = oc.getContext('2d');
  oc.width = w;
  oc.height = h;
  octx.drawImage(canvas, 0 ,0);

  canvas.width = h;
  canvas.height = w;
  ctx.save();
  ctx.translate(h/2, w/2);
  ctx.rotate(angle_rad);
  ctx.drawImage(oc, - w/2, - h/2);
  ctx.restore();

  return canvas.toDataURL();
};

export const handleBlur = () => {
  ctx.save();
  const blur = 4;
  let sum = 0;
  let delta = 5;
  let alpha_left = 1 / (2 * Math.PI * delta * delta);
  let step = blur < 3 ? 1 : 2;
  for (let y = -blur; y <= blur; y += step) {
    for (let x = -blur; x <= blur; x += step) {
      let weight = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta));
      sum += weight;
    }
  }
  for (let y = -blur; y <= blur; y += step) {
    for (let x = -blur; x <= blur; x += step) {
      ctx.globalAlpha = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta)) / sum * blur;
      ctx.drawImage(canvas,x,y);
    }
  }
  ctx.restore();

  return canvas.toDataURL();
};

//const rgbToHex = (r, g, b) => "#" + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);

export const getColor = (loc) => {
  const pixel = ctx.getImageData(loc[0], loc[1], 1, 1).data;
  return "#" + ("000000" + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6);
};

/**

 const xorRect = (ctx,x,y,w,h, dotted = 1) => {
  if (w < 0) {
    x += w;
    w = -w;
  }
  if (h < 0) {
    y += h;
    h = -h;
  }

  if (w == 0 || h == 0) return;
  if (!dotted) dotted = 1;

  const imageData = ctx.getImageData(x,y,w,h),
        rWidth = (imageData.width-1)*4;
        rHeight = ((imageData.height-1)*4)*imageData.width;

  //top + bottom
  for (let i = 1; i < imageData.width - 1 ; i += dotted){
    let index=i*4;
    imageData.data[index]= 255 - imageData.data[index];
    imageData.data[index+1]= 255 - imageData.data[index+1];
    imageData.data[index+2]= 255 - imageData.data[index+2];
    index += rHeight;
    imageData.data[index]= 255 - imageData.data[index];
    imageData.data[index+1]= 255 - imageData.data[index+1];
    imageData.data[index+2]= 255 - imageData.data[index+2];
  }

  //left + right
  for (let i = dotted; i < imageData.height ; i += dotted){
    let index=(i*4)*imageData.width;
    imageData.data[index]= 255 - imageData.data[index];
    imageData.data[index+1]= 255 - imageData.data[index+1];
    imageData.data[index+2]= 255 - imageData.data[index+2];
    index += rWidth;
    imageData.data[index]= 255 - imageData.data[index];
    imageData.data[index+1]= 255 - imageData.data[index+1];
    imageData.data[index+2]= 255 - imageData.data[index+2];
  }
  ctx.putImageData(imageData,x + (w < 0 ? w : 0),y + (h < 0 ? h : 0));
};

 */