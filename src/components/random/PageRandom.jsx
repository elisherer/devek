import { useNavigate } from "react-router";
import styled from "styled-components";

import { CopyToClipboard, Radio, TextArea } from "../_lib";
import { actions, useStore } from "./PageRandom.store";
import { generatePassword, generateTable, uuidv4 } from "./rand";

let table = null,
  tableFlags = null;
let ticks = null;

const ButtonsWrapper = styled.div`
  margin-top: 20px;
`;

const RangeWrapper = styled.label`
  display: flex !important;
  span {
    display: inline-block;
    width: 90px;
  }
  input[type="range"] {
    flex: 1;
  }
`;

const pageRoutes = ["password", "guid"];

const PageRandom = ({ location }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  const navigate = useNavigate();
  if (!pageRoutes.includes(type || "")) {
    navigate("/" + pathSegments[0] + "/" + pageRoutes[0]);
    return;
  }

  let result, flags, size;
  const state = useStore();
  const { count } = state;

  if (type === "password") {
    flags = state.flags;
    size = state.size;
    const results = [];

    if (tableFlags !== flags) {
      table = generateTable(flags);
    }
    for (let i = 0; i < count; i++) results.push(generatePassword(size, table));
    result = results.join("\n");
  } else if (type === "guid") {
    const results = [];
    for (let i = 0; i < count; i++) results.push(uuidv4());
    result = results.join("\n");
  } else {
    result = "N/A";
  }

  if (!ticks) {
    const opts = [];
    for (let i = 6; i < 65; i++) {
      opts.push(<option key={i}>{i}</option>);
    }
    ticks = <datalist id="random_password_size">{opts}</datalist>;
  }

  return (
    <div>
      <RangeWrapper>
        <span>Count ({count})</span>
        <input type="range" min="1" max="16" value={count} onChange={actions.count} />
      </RangeWrapper>

      {type === "password" && (
        <div>
          <RangeWrapper>
            <span>Length ({size})</span>
            <input
              type="range"
              min="6"
              max="64"
              step="1"
              list="random_password_size"
              value={size}
              onChange={actions.size}
            />
            {ticks}
          </RangeWrapper>

          <label>Flags</label>
          <Radio flexBasis={16}>
            <div data-active={flags.includes("a") || null} data-flag="a" onClick={actions.flags}>
              a-z
            </div>
            <div data-active={flags.includes("A") || null} data-flag="A" onClick={actions.flags}>
              A-Z
            </div>
            <div data-active={flags.includes("0") || null} data-flag="0" onClick={actions.flags}>
              0-9
            </div>
            <div data-active={flags.includes("!") || null} data-flag="!" onClick={actions.flags}>
              !@#...
            </div>
            <div data-active={flags.includes("O") || null} data-flag="O" onClick={actions.flags}>
              1lIioO0
            </div>
          </Radio>
        </div>
      )}

      <ButtonsWrapper>
        <button onClick={actions.refresh}>Regenerate</button>
      </ButtonsWrapper>

      <h1>Result</h1>
      <CopyToClipboard from="random_result" />
      <TextArea id="random_result" readOnly value={result} />
    </div>
  );
};

export default PageRandom;
