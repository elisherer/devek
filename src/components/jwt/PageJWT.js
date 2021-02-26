import { Redirect } from "react-router-dom";
import { CopyToClipboard, TextArea, TextBox } from "../_lib";

import { useStore, actions } from "./PageJWT.store";
import styled from "styled-components";

const colors = {
  header: "crimson",
  payload: "mediumorchid",
  sig: "dodgerblue"
};

const HeaderTextArea = styled(TextArea)`
  border-bottom: none;
  margin-bottom: 0;
  pre {
    color: ${colors.header};
    padding-bottom: 8px;
  }
`;

const PayloadTextArea = styled(TextArea)`
  margin-bottom: 0;
  pre {
    color: ${colors.payload};
    padding-bottom: 8px;
  }
`;
const SignatureTextArea = styled(TextArea)`
  border-top: none;
  pre {
    color: ${colors.sig};
  }
`;

const FullWidthTextBox = styled(TextBox)`
  max-width: 100%;
`;

const pageRoutes = ["decode", "encode"];

const PageJWT = ({ location }: { location: Object }) => {
  const pathSegments = location.pathname.substr(1).split("/");
  const type = pathSegments[1];
  if (!pageRoutes.includes(type)) {
    return <Redirect to={"/" + pathSegments[0] + "/" + pageRoutes[0]} />;
  }

  const state = useStore();

  if (type === "encode") {
    return (
      <div>
        <label>Payload</label>
        <HeaderTextArea value={state.header} readOnly />
        <PayloadTextArea value={state.in_payload} onChange={actions.in_payload} autoFocus />
        <SignatureTextArea value={state.secret ? state.sig : ""} readOnly />

        <label>Secret key (HS256; UTF-8)</label>
        <TextBox value={state.secret} onChange={actions.secret} />

        {state.error ? (
          <p style={{ color: "red" }}>{state.error}</p>
        ) : (
          <div>
            <span>Token</span>
            <CopyToClipboard from="jwt" />
            <TextArea
              id="jwt"
              invalid={state.error}
              value={state.out_token}
              selectOnFocus
              readOnly
            />
          </div>
        )}
      </div>
    );
  }

  const resultHTML =
    `<div style="color: ${colors.header}; padding-bottom: 8px;">${state.header || ""}</div>` +
    `<div style="color: ${colors.payload}; padding-bottom: 8px;">${state.payload || ""}</div>` +
    `<div style="color: ${colors.sig}">${state.sig || ""}</div>`;

  return (
    <div>
      <span>Token</span>
      <CopyToClipboard from="jwt" />
      <FullWidthTextBox
        id="jwt"
        autoFocus
        selectOnFocus
        invalid={state.error}
        value={state.in_token}
        onChange={actions.in_token}
      />
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}

      <label>Contents:</label>
      <TextArea readOnly={type === "decode"} html value={resultHTML} />
    </div>
  );
};

export default PageJWT;
