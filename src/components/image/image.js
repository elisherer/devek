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

  for (let j = 0; j < imageData.height ; j++)
  {
    for (let i = 0; i < imageData.width ; i++)
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

export const resize = e => {
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