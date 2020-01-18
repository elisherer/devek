import React, { useMemo, useCallback } from 'react';
import { DropDownMenu, TextBox } from '../_lib';
import { Redirect }  from 'react-router-dom';
import { useStore, actions } from './PageImage.store';
import getEventLocation from './getEventLocation';
import {
  loadFileAsync,
  loadFromDataUri,
} from './image';
import { 
  mdiOpenInApp,
  mdiRotateLeft, 
  mdiRotateRight,
  mdiFlipHorizontal,
  mdiFlipVertical,
  mdiCpu64Bit,
  mdiInvertColors,
  mdiGradient,
  mdiBlur,
  mdiImage,
  mdiCrop,
  mdiResize
} from '@mdi/js';
import Icon from '@mdi/react';
import styled from 'styled-components';

const onDragOver = e => {
  e.dataTransfer.dropEffect = 'link';
  e.stopPropagation();
  e.preventDefault();
};

const onDrop = e => {
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  loadFileAsync(file, actions.loaded);
  actions.onDragLeave(e);
};

const onFileChange = e => {
  const file = e.target.files && e.target.files[0];
  loadFileAsync(file, actions.loaded);
};

const moveBand = (x,y,w,h) => {
  if (!w || !h) {
    w = 2; h = 2;
  }
  if (w < 0) {
    x += w;
    w = -w;
  }
  if (h < 0) {
    y += h;
    h = -h;
  }

  actions.cropInput({
    x, y, width: w - 2, height: h - 2
  });
};

let isDrawing = false, start_X, start_Y;

function onCropMouseUp(e) {
  isDrawing = false;
  e.target.style.cursor = "default";
}

function onCropMouseMove(e) {
  if (!isDrawing) return;
  const loc = getEventLocation(e);
  moveBand(start_X, start_Y, loc[0] - start_X, loc[1] - start_Y, 2);
}

function onCropMouseDown(e) {
  e.target.style.cursor = "crosshair";
  isDrawing = true;

  const loc = getEventLocation(e);
  start_X = loc[0];
  start_Y = loc[1];

  moveBand(start_X, start_Y, 0, 0);
}

const CanvasWrapper = styled.section`
  position: relative;
  @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    margin: 0 20px;
  }
`;

const ToolbarSection = styled.section`
  padding: 4px;
  @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    padding: 20px;
  }
`;

const Toolbar = styled.div`
  color: ${({ loaded }) => loaded ? 'inherit' : '#ddd'};
  display: flex;
  min-height: 40px;
  button {
    margin-right: 6px;
  }
`;

const InlineTextBox = styled(TextBox)`
  max-width: 90px;
  display: inline-block;
  margin-bottom: 0; /* disable textbox bottom margin*/
`;

const DropBox = styled.label`
  border: 2px dashed ${({ dragging }) => dragging ? '#333' : '#888'};
  padding: 20px;
  margin: 0 4px;
  @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    margin: 0 20px;
  }
`;

const Hint = styled.div`
  display: none;
  @media (min-width: ${({ theme }) => theme.screenDesktopMin}) {
    display: block;
    position: absolute;
  }
`;

const RubberBand = styled.div`
  position:absolute;
  border:1px dotted white;
  mix-blend-mode: difference;
  pointer-events:none;
`;

const pageRoutes = ['', 'filters','crop','resize','picker'];

const PageImage = ({ location } : { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split('/');
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || '')) {
    return <Redirect to={'/' + pathSegments[0] + '/' + pageRoutes[0]} />;
  }

  const { dragging, src, color, select, resize, crop } = useStore();

  const toBase64 = useCallback(() => {
    const w = window.open('about:blank');
    setTimeout(() => {
      const pre = w.document.createElement('pre');
      pre.style.overflowWrap = "break-word";
      pre.style.whiteSpace = "pre-wrap";
      pre.innerHTML = src;
      w.document.body.appendChild(pre);
    }, 0);
  }, [src]);

  const loaded = !!src;
  const disabled = !loaded;

  const picker = type === 'picker',
    cropper = type === 'crop';

  const dropHandlers = {
    onDragEnter: actions.onDragEnter,
    onDragLeave: actions.onDragLeave,
    onDragOver,
    onDrop
  };

  const dropBox = useMemo(() => (
    <DropBox dragging={dragging} {...dropHandlers}>
      Click and browse for an image or Drag &amp; Drop it here
      <input type="file" style={{display: 'none'}} onChange={onFileChange} />
    </DropBox>
  ), []);


  const loadMenu = useMemo(() => {
    return [
      { 
        children: (
          <label>From device...<input type="file" style={{display: 'none'}} onChange={onFileChange} /></label>
        )
      },
      {
        children: (
          <label>From Data URI...</label>
        ),
        onClick: () => loadFromDataUri(actions.loaded)
      }
    ];
  }, []);

  return (
    <>
      <ToolbarSection {...dropHandlers} >
        {!type && (
          <Toolbar loaded={loaded}>
            <DropDownMenu menu={loadMenu}>
              <button className="tool" title="Open"><Icon path={mdiOpenInApp } size={1} /></button>
            </DropDownMenu>
            <button className="tool" disabled={disabled} onClick={actions.rotateRight} title="Rotate right"><Icon path={mdiRotateRight} size={1} /></button>
            <button className="tool" disabled={disabled} onClick={actions.rotateLeft} title="Rotate left"><Icon path={mdiRotateLeft} size={1} /></button>
            <button className="tool" disabled={disabled} onClick={actions.flipH} data-dir="h" title="Flip Horizontal"><Icon path={mdiFlipHorizontal} size={1}/></button>
            <button className="tool" disabled={disabled} onClick={actions.flipV} data-dir="v" title="Flip Vertical"><Icon path={mdiFlipVertical} size={1}/></button>
            <button className="tool" disabled={disabled} onClick={toBase64} title="To Base64"><Icon path={mdiCpu64Bit} size={1}/></button>
          </Toolbar>
        )}
        {type === 'filters' && (
          <Toolbar loaded={loaded}>
            <button className="tool" disabled={disabled} onClick={actions.invert} title="Invert Colors"><Icon path={mdiInvertColors} size={1}/></button>
            <button className="tool" disabled={disabled} onClick={actions.grayscale} title="Grayscale"><Icon path={mdiGradient} size={1}/></button>
            <button className="tool" disabled={disabled} onClick={actions.sepia} title="Sepia"><Icon path={mdiImage} color="#704214" size={1}/></button>
            <button className="tool" disabled={disabled} onClick={actions.blur} title="Blur"><Icon path={mdiBlur} size={1}/></button>
          </Toolbar>
        )}
        { type === 'crop' && (
          <Toolbar loaded={loaded}>
            <InlineTextBox disabled={disabled} type="number" value={crop.x} data-input="x" onChange={actions.cropInput} />
            ,<InlineTextBox disabled={disabled} type="number" value={crop.y} data-input="y" onChange={actions.cropInput} /> (
            <InlineTextBox disabled={disabled} type="number" value={crop.width} data-input="width" onChange={actions.cropInput} /> x
            <InlineTextBox disabled={disabled} type="number" value={crop.height} data-input="height" onChange={actions.cropInput} /> )
            &nbsp;
            <button className="tool" disabled={disabled} onClick={actions.crop} title="Crop"><Icon path={mdiCrop} size={1}/></button>
          </Toolbar>
        )}
        { type === 'resize' && (
          <Toolbar loaded={loaded}>
            <InlineTextBox disabled={disabled} type="number" value={resize.width} data-input="width" onChange={actions.resizeInput} /> x <InlineTextBox disabled={disabled} type="number" value={resize.height} data-input="height" onChange={actions.resizeInput} />
            &nbsp;
            <button className="tool" disabled={disabled} onClick={actions.resize} title="Resize"><Icon path={mdiResize} size={1}/></button>
          </Toolbar>
        )}
        { type === 'picker' && (
          <Toolbar loaded={loaded}>
            <div>Picker: <input disabled={disabled} type="color" readOnly value={color} /> ► <input disabled={disabled} readOnly type="color" value={select} />&nbsp;<InlineTextBox readOnly value={select} /></div>
          </Toolbar>
        )}
        {type === 'crop' && (
          <Hint>* You can draw a rectangle on the image to set the coordinates before cropping</Hint>
        )}
      </ToolbarSection>
      {!loaded && dropBox}
      <CanvasWrapper {...dropHandlers}>
        {cropper && loaded && <RubberBand style={{ left: crop.x, top: crop.y, width: crop.width, height: crop.height }} />}
        {src && loaded && <img src={src} alt="" draggable={false}
          onMouseUp={picker ? actions.pick : cropper ? onCropMouseUp: undefined}
          onMouseMove={picker ? actions.peek : cropper ? onCropMouseMove: undefined}
          onMouseDown={cropper ? onCropMouseDown : undefined}
        />}
      </CanvasWrapper>
    </>
  );
};

export default PageImage;