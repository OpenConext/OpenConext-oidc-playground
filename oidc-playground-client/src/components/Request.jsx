import React from "react";
import JSONPretty from "react-json-pretty";
import {observer} from "mobx-react";
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

  const {request_url, request_headers, request_body, result} = store.request || {};

  const queryParameters = {};
  if (authorization_url) {
    const query = authorization_url.substring(authorization_url.indexOf("?") + 1);
    const urlSearchParams = new URLSearchParams(query);
    Array.from(urlSearchParams.keys()).forEach(key => queryParameters[key] = urlSearchParams.get(key));
  }

  return (
    <div className="block">
      {authorization_url && (
        <div className="fieldset">
          <InfoLabel label="Authorization Request - Browser redirect" toolTip={authorizationRequestT()} copyToClipBoardText={authorization_url}/>
          <input disabled value={authorization_url}/>
        </div>
      )}
      {authorization_url && (
        <div className="fieldset">
          <label>Query parameters</label>
          <JSONPretty data={queryParameters}/>
        </div>
      )}
      {request_url && (
        <div className="fieldset">
          <InfoLabel label="Token Request - Backchannel request" toolTip={tokenRequestT()} copyToClipBoardText={request_url}/>
          <input disabled value={request_url}/>
        </div>
      )}
      {request_headers && (
        <div className="fieldset">
          <label>Headers</label>
          <JSONPretty data={request_headers}/>
        </div>
      )}
      {request_body && (
        <div className="fieldset">
          <label>Form parameters</label>
          <JSONPretty data={request_body}/>
        </div>
      )}

      {result && (
        <div className="fieldset">
          <label>Result</label>
          <JSONPretty data={result}/>
        </div>
      )}
    </div>
  );
});
