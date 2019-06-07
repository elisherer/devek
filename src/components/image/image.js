let _ref, canvas, ctx, base64Source;

export const initCanvas = ref => {
  _ref = ref;
  if (ref.current === canvas) return;
  canvas = ref.current;
  ctx = canvas.getContext('2d');
};

export const loadFileAsync = (file, callback) => {
  if (!canvas) initCanvas(_ref);
  if (typeof FileReader === "undefined" || !file || file.type.indexOf("image") === -1) return; // no file or not an image
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      base64Source = img.src;
      callback(img.width, img.height);
    };
    img.src = e.target.result;
  };
  reader.onerror = () => {
    reader.abort();
  };
  reader.readAsDataURL(file);
};

export const toBase64 = () => {
  const w = window.open('about:blank');
  setTimeout(() => {
    const pre = w.document.createElement('pre');
    pre.style.overflowWrap = "break-word";
    pre.style.whiteSpace = "pre-wrap";
    pre.innerHTML = base64Source;
    w.document.body.appendChild(pre);
  }, 0);
};

export const greyscale = () => {
  const imageData = ctx.getImageData(0,0, ctx.canvas.width, ctx.canvas.height);

  for (let j = 0; j < imageData.width ; j++)
  {
    for (let i = 0; i < imageData.height ; i++)
    {
      const index=(i*4)*imageData.width+(j*4),
        red=imageData.data[index],
        green=imageData.data[index+1],
        blue=imageData.data[index+2],
        alpha=imageData.data[index+3],
        average=(red+green+blue)/3;
      imageData.data[index]=average;
      imageData.data[index+1]=average;
      imageData.data[index+2]=average;
      imageData.data[index+3]=alpha;
    }
  }
  ctx.putImageData(imageData,0, 0);

  base64Source = canvas.toDataURL();
};

export const invert = () => {

  ctx.globalCompositeOperation = 'difference';
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  base64Source = canvas.toDataURL();
};

export const handleResize = e => {
  let newWidth = parseInt(e.target.dataset.width),
    newHeight = parseInt(e.target.dataset.height);

  const oc = document.createElement('canvas'),
    octx = oc.getContext('2d');
  oc.width = newWidth;
  oc.height = newHeight;
  octx.drawImage(canvas, 0, 0, newWidth, newHeight);

  canvas.width = newWidth;
  canvas.height = newHeight;
  ctx.drawImage(oc, 0, 0);
  base64Source = canvas.toDataURL();
};

export const handleCrop = e => {
  let
    x = parseInt(e.target.dataset.x),
    y = parseInt(e.target.dataset.y),
    width = parseInt(e.target.dataset.width),
    height = parseInt(e.target.dataset.height);

  const oc = document.createElement('canvas'),
    octx = oc.getContext('2d');
  oc.width = width;
  oc.height = height;
  octx.drawImage(canvas, x ,y ,width, height, 0, 0, width, height);

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(oc, 0, 0);
  base64Source = canvas.toDataURL();
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