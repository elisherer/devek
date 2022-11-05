import { CopyToClipboard, TextArea } from "../_lib";
import { useStore, actions } from "./PageASN1.store";
import { ASN1 } from "./asn1";

const PageASN1 = () => {
  const state = useStore();

  const { input } = state;

  let result,
    error = null;
  try {
    result = JSON.stringify(ASN1.parsePEM(input, true).info, null, 2);
  } catch (e) {
    error = e.message;
  }

  return (
    <div>
      <label>PEM/DER:</label>
      <TextArea autoFocus onChange={actions.set} value={input} />

      <h1>Result</h1>
      {!error && <CopyToClipboard from="asn1-result" />}
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <TextArea readOnly value={result} id="asn1-result" />
      )}
    </div>
  );
};

export default PageASN1;
