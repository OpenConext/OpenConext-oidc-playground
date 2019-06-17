import React from "react";
import JSONPretty from "react-json-pretty";
import { observer } from "mobx-react";
import store from "store";
import {InfoLabel} from "./InfoLabel";
import {authorizationRequestT, tokenRequestT} from "./settings/Tooltips";

export const Request = observer(() => {
  const authorization_url = localStorage.getItem("authorization_url");

  if (!store.request && !authorization_url) {
    return (
      <div className="block no-data">
        <label>No request data yet.</label>
      </div>
    );
  }

  const { request_url, request_headers, request_body, result } = store.request || {};

  return (
    <div className="block">
      {authorization_url && (
        <div className="fieldset">
          <InfoLabel label="Authorization Request" toolTip={authorizationRequestT()}/>
          <input disabled value={authorization_url} />
        </div>
      )}
      {request_url && (
        <div className="fieldset">
          <InfoLabel label="Token Request" toolTip={tokenRequestT()}/>
          <input disabled value={request_url} />
        </div>
      )}
      {request_headers && (
        <div className="fieldset">
          <label>Headers</label>
          <JSONPretty id="json-pretty" data={request_headers} />
        </div>
      )}
      {request_body && (
        <div className="fieldset">
          <label>Form parameters</label>
          <JSONPretty id="json-pretty" data={request_body} />
        </div>
      )}

      {result && (
        <div className="fieldset">
          <label>Result</label>
          <JSONPretty id="json-pretty" data={result} />
        </div>
      )}
    </div>
  );
});
