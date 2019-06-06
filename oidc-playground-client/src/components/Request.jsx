import React from "react";
import JSONPretty from "react-json-pretty";
import {observer} from "mobx-react";
import store from "store";

export const Request = observer(() => {
  const authorization_url = localStorage.getItem("authorization_url");

  if (!store.request && !authorization_url) {
    return <label>No request data yet.</label>;
  }

  const {request_url, request_headers, request_body, result} = store.request || {};

  return (
    <div>
      {authorization_url && (
        <>
          <label>Authorization URL</label>
          <input disabled value={authorization_url}/>
        </>
      )}
      {request_url && (
        <>
          <label>Request URL</label>
          <input disabled value={request_url}/>
        </>
      )}
      {request_headers && (
        <>
          <label>Headers</label>
          <JSONPretty id="json-pretty" data={request_headers}/>
        </>
      )}
      {request_body && (
        <>
          <label>Form parameters</label>
          <JSONPretty id="json-pretty" data={request_body}/>
        </>
      )}
      {result && (
        <>
          <label>Result</label>
          <JSONPretty id="json-pretty" data={result}/>
        </>
      )}
    </div>
  );
});
