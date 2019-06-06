import React from "react";
import JSONPretty from "react-json-pretty";
import { observer } from "mobx-react";
import store from "store";

export const Request = observer(() => {
  if (!store.request) {
    return <label>No request data yet.</label>;
  }

  const { request_url, request_headers, request_body, result } = store.request;

  const codeFlow = request_body.grant_type === "authorization_code";
  const authorization_url = localStorage.getItem("authorization_url");

  return (
    <div>
      {codeFlow && (
        <>
          <label>Authorization URL</label>
          <input disabled value={authorization_url} />
        </>
      )}

      <label>Request URL</label>
      <input disabled value={request_url} />

      <label>Headers</label>
      <JSONPretty id="json-pretty" data={request_headers} />

      <label>Form parameters</label>
      <JSONPretty id="json-pretty" data={request_body} />

      {result && (
        <>
          <label>Result</label>
          <JSONPretty id="json-pretty" data={result} />
        </>
      )}
    </div>
  );
});
