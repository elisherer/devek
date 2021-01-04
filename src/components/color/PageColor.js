import { CopyToClipboard, ListBox, Radio, TextBox } from "../_lib";
import { Redirect } from "react-router-dom";
import { useStore, actions } from "./PageColor.store";
import { formatters, parsers, gradients } from "./color.js";
import x11 from "./x11";
import styled from "styled-components";

const x11Colors = [{ name: "custom", value: "#000000" }].concat(
  Object.keys(x11).map(wc => ({ name: wc, value: "#" + x11[wc] }))
);
const hexRegex = /#[a-z0-9]{6}/i;
const fixValue = value => {
  if (hexRegex.test(value)) return value;
  let el = document.createElement("div");
  el.style.color = value;
  let hex = window.getComputedStyle(document.body.appendChild(el)).color;
  document.body.removeChild(el);
  if (!hexRegex.test(hex)) {
    hex = formatters.hex(parsers.rgba(hex));
  }
  return hex;
};

const Preview = styled.div`
  width: 200px;
  height: ${({ gradient }) => (gradient ? "120px" : "40px")};
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;
  background-image: ${({ theme }) => theme.checkeredBackground};
  margin-bottom: ${({ gradient }) => (gradient ? "0px" : "30px")};
  padding: ${({ gradient }) => (gradient ? "12px" : "5px")};
  > div {
    width: ${({ gradient }) => (gradient ? "96px" : "100px")};
    height: ${({ gradient }) => (gradient ? "96px" : "30px")};
    margin: 0 auto;
  }
`;

const GradientsRadio = styled(Radio)`
  div {
    border: 2px solid ${({ theme }) => theme.greyBorder};
    flex-basis: 20%;
    font-size: 20px;
    width: 48px;
    height: 48px;
    &:hover {
      border-color: grey;
    }
    &[data-active] {
      border-color: black;
    }
  }
`;

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const PositionLabel = styled.span`
  display: inline-block;
  width: 115px;
`;

const pageRoutes = ["convert", "gradient"];

const PageColor = ({ location }: { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  if (!pageRoutes.includes(type || "")) {
    return <Redirect to={"/" + pathSegments[0] + "/" + pageRoutes[0]} />;
  }

  const state = useStore();

  if (type === "convert") {
    const { errors, rgba, hex, hsla, hwba, cmyka, parsed } = state;

    const preview = { background: formatters.rgba(parsed) };

    return (
      <div>
        <label>Preview</label>
        <Preview>
          <div style={preview} />
        </Preview>

        <Wrapper>
          <label>Select an X11 web-color:</label>
          <ListBox
            size={1}
            value={formatters.hex(parsed)}
            onChange={actions.hex}
            options={x11Colors}
            uid={c => c.name}
          />
        </Wrapper>

        <Wrapper>
          <span>Picker: </span>
          <input type="color" onChange={actions.hex} value={formatters.hex(parsed)} />
        </Wrapper>

        <span>RGB/A:</span>
        <CopyToClipboard from="color_rgba" />
        <TextBox
          invalid={errors.rgba}
          id="color_rgba"
          autoFocus
          onChange={actions.rgba}
          value={rgba}
        />

        <span>Hex:</span>
        <CopyToClipboard from="color_hex" />
        <TextBox invalid={errors.hex} id="color_hex" onChange={actions.hex} value={hex} />

        <span>HSL/A:</span>
        <CopyToClipboard from="color_hsla" />
        <TextBox invalid={errors.hsla} id="color_hsla" onChange={actions.hsla} value={hsla} />

        <span>HWB/A:</span>
        <CopyToClipboard from="color_hwba" />
        <TextBox invalid={errors.hwba} id="color_hwba" onChange={actions.hwba} value={hwba} />

        <span>CMYK/A:</span>
        <CopyToClipboard from="color_cmyka" />
        <TextBox invalid={errors.cmyka} id="color_cmyka" onChange={actions.cmyka} value={cmyka} />
      </div>
    );
  } else if (type === "gradient") {
    const { gradientStop, gradientType } = state;

    const gradientCss = `${gradientType}, ${gradientStop[0].color} ${gradientStop[0].pos}%,${gradientStop[1].color} ${gradientStop[1].pos}%)`;

    const preview = { background: gradientCss };

    const colorInput = index => (
      <>
        <span>Color {index + 1}:</span>{" "}
        <input
          type="color"
          data-index={index}
          data-field="color"
          onChange={actions.gradientStop}
          value={fixValue(gradientStop[index].color)}
        />
        <TextBox
          data-index={index}
          data-field="color"
          onChange={actions.gradientStop}
          value={gradientStop[index].color}
        />
        <label>
          <PositionLabel>Position ({gradientStop[index].pos}%)</PositionLabel>
          <input
            type="range"
            min="0"
            max="100"
            data-index={index}
            data-field="pos"
            value={gradientStop[index].pos}
            onChange={actions.gradientStop}
          />
        </label>
      </>
    );

    return (
      <div>
        {colorInput(0)}
        {colorInput(1)}
        <button onClick={actions.switchColors}>Reverse order</button>

        <label>Gradient type</label>
        <GradientsRadio>
          {gradients.map(g => (
            <div
              key={g}
              data-active={gradientType === g || null}
              data-gt={g}
              onClick={actions.gradientType}
              style={{
                background: `${g}, ${gradientStop[0].color},${gradientStop[1].color})`
              }}
            />
          ))}
        </GradientsRadio>

        <span>Gradient CSS:</span>
        <CopyToClipboard from="color_gradient" />
        <TextBox id="color_gradient" value={gradientCss} readOnly />

        <label>Preview</label>
        <Preview gradient>
          <div style={preview} />
        </Preview>
      </div>
    );
  }
};

export default PageColor;
