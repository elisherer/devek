import { Checkbox, CopyToClipboard, TextArea } from "../_lib";
import { useStore, actions } from "./PageDiff.store";
import { textFunctions } from "../text/text";
import styled from "styled-components";

const he = textFunctions.html.encode.func;

const prepareLine = (nr, typ, aText) => {
  let output = "<tr><td>" + (nr >= 0 ? nr + 1 : "&nbsp;") + "<td><span style='width:100%'";
  if (typ) output += ' class="' + typ + '"';
  output += ">" + he(aText) + "</span></td></tr>";
  return output;
};

const prepareLines = (diff, a, b) => {
  let n = 0,
    output = `<table><tbody>`;

  for (let fdx = 0; fdx < diff.length; fdx++) {
    const item = diff[fdx];

    // write unchanged lines
    while (n < item.startB && n < b.length) {
      output += prepareLine(n, null, b[n]);
      n++;
    }

    // write deleted lines
    for (let m = 0; m < item.deletedA; m++) {
      output += prepareLine(-1, "_d", a[item.startA + m]);
    }

    // write inserted lines
    while (n < item.startB + item.insertedB) {
      output += prepareLine(n, "_i", b[n]);
      n++;
    }
  }

  // write rest of unchanged lines
  while (n < b.length) {
    output += prepareLine(n, null, b[n]);
    n++;
  }
  output += `</tbody></table>`;
  return output;
};

const prepareBlocks = (diff, a, b) => {
  let n = 0,
    output = ``;

  for (let fdx = 0; fdx < diff.length; fdx++) {
    const item = diff[fdx];

    // write unchanged blocks
    while (n < item.startB && n < b.length) {
      output += he(b[n]);
      n++;
    }

    // write deleted blocks
    for (let m = 0; m < item.deletedA; m++) {
      output += `<span class="_d">${he(a[item.startA + m])}</span>`;
    }

    // write inserted blocks
    while (n < item.startB + item.insertedB) {
      output += `<span class="_i">${he(b[n])}</span>`;
      n++;
    }
  }

  // write rest of unchanged lines
  while (n < b.length) {
    output += he(b[n]);
    n++;
  }
  return output;
};

const OutputTextArea = styled(TextArea)`
  table {
    empty-cells: show;

    border-collapse: collapse;
    table-layout: fixed;
    padding: 0;

    td:first-of-type {
      color: silver;
      text-align: right;
      width: 40px;
      padding-right: 8px;
    }
  }
  ._i {
    color: black;
    background-color: #80ff80;
  }
  ._d {
    color: black;
    background-color: #ff8080;
  }
`;

const BWrapper = styled.div`
  padding-top: 20px;
`;
const ActionsWrapper = styled.div`
  button {
    margin-right: 6px;
    margin-bottom: 4px;
  }
`;
const FlagsWrapper = styled.div`
  padding: 20px;
`;

const PageDiff = () => {
  const state = useStore();

  const { inputA, inputB, trimSpace, ignoreSpace, ignoreCase, result, type, error } = state;

  const output = !result
    ? ""
    : type === "line"
    ? prepareLines(result.diff, result.a, result.b)
    : prepareBlocks(result.diff, result.a, result.b);

  return (
    <div>
      <label>Input A (&quot;old&quot;):</label>
      <TextArea autoFocus onChange={actions.inputA} value={inputA} />

      <BWrapper>
        <label>Input B (&quot;new&quot;):</label>
        <TextArea onChange={actions.inputB} value={inputB} />
      </BWrapper>

      <FlagsWrapper>
        <Checkbox label="Trim spaces" checked={trimSpace} onChange={actions.trimSpace} />
        <Checkbox label="Ignore spaces" checked={ignoreSpace} onChange={actions.ignoreSpace} />
        <Checkbox label="Case sensitive" checked={!ignoreCase} onChange={actions.ignoreCase} />
      </FlagsWrapper>

      <ActionsWrapper>
        <button onClick={actions.lineDiff}>Line Diff</button>
        <button onClick={actions.blockDiff}>Block Diff</button>
      </ActionsWrapper>

      <h1>Result</h1>
      {!error && <CopyToClipboard from="diff_result" />}
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <OutputTextArea readOnly html value={output} id="diff_result" />
      )}
    </div>
  );
};

export default PageDiff;
