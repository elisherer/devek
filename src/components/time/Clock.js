import React, {useEffect, useRef} from 'react';

let watchFace;

function drawFace(ctx, r) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 2*Math.PI);
  
  ctx.lineWidth = r*0.04;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  
  ctx.font = 'bold ' + r*0.15 + 'px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'black';
  for (let num = 1; num < 13; num++){
    const ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -r*0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, r*0.85);
    ctx.rotate(-ang);
  }
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}
  
const drawClockFactory = (ctx, r) => function drawClock() {
  ctx.putImageData(watchFace, 0, 0);
  const now = new Date(); 
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds() + now.getMilliseconds() / 1000;
  drawHand(ctx, ((hour % 12)*Math.PI/6) + (minute*Math.PI/(6*60)) + (second*Math.PI/(360*60)), r*0.5, r*0.04);
  drawHand(ctx, (minute*Math.PI/30) + (second*Math.PI/(30*60)), r*0.8, r*0.04);
  drawHand(ctx, second*Math.PI/30, r*0.9, r*0.02, 'red');
  ctx.beginPath();
  ctx.arc(0, 0, r*0.05, 0, 2*Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
}
  
function drawHand(ctx, pos, length, width, style = 'black') {
  ctx.beginPath();
  ctx.rotate(pos);
  ctx.moveTo(0,0);
  ctx.lineTo(0, -length);

  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.strokeStyle = style;
  ctx.stroke();

  ctx.rotate(-pos);
}


const Clock = props => {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    const r = 0.9 * Math.min(canvas.height, canvas.width) / 2;
    if (!watchFace) {
      watchFace = drawFace(ctx, r)
    }
    const callback = drawClockFactory(ctx, r);
    let id;
    const tick = () => {
      callback();
      id = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(id);
  }, []);

  return <canvas ref={ref} {...props} />
};

export default Clock;