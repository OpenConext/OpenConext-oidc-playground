import React from "react";
import JSONPretty from "react-json-pretty";
import {observer} from "mobx-react";
import store from "store";
import {InfoLabel} from "./InfoLabel";
import {
  authorizationRequestT,
  clientAssertionToolTip,
  discoveryT,
  introspectT,
  signedJWTRequestParameterT,
  tokenRequestFrontChannelT,
  tokenRequestT,
  userInfoT
} from "./settings/Tooltips";
import {DecodeToken} from "./JWT";

export const Request = observer(() => {
  const authorization_url = localStorage.getItem("authorization_url");

  const state = JSON.parse(localStorage.getItem("state"));

  if (!store.request && !authorization_url) {
    return (
      <div className="block no-data">
        <label>No request data yet.</label>
      </div>
    );
  }
  const {request_url, request_headers, request_body, result} = store.request || {};
  const {processingTime} = store;

  const queryParameters = {};
  if (authorization_url) {
    const query = authorization_url.substring(authorization_url.indexOf("?") + 1);
    const urlSearchParams = new URLSearchParams(query);
    Array.from(urlSearchParams.keys()).forEach(key => queryParameters[key] = urlSearchParams.get(key));
  }
  const frontChannelTokenRequest = state && state.form ? state.form.frontChannelTokenRequest : false;

  const {requestLabel, toolTip} =
    (request_url && request_url.endsWith("userinfo")) ? {
        requestLabel: "UserInfo endpoint",
        toolTip: userInfoT()
      } :
      (request_url && request_url.endsWith("introspect")) ? {
          requestLabel: "Introspect endpoint",
          toolTip: introspectT()
        } :
        (request_url && request_url.endsWith("openid-configuration")) ? {
            requestLabel: "Discovery endpoint",
            toolTip: discoveryT()
          } :
          (request_url && frontChannelTokenRequest) ? {
            requestLabel: "Token Request - front channel request",
            toolTip: tokenRequestFrontChannelT()
          } : (request_url ? {
            requestLabel: "Token Request - back channel request",
            toolTip: tokenRequestT()
          } : {});
  const tookTime = processingTime ? `- took ${processingTime} ms` : "";

  const sortObject = o => Object.keys(o).sort().reduce((acc, key) => {
    acc[key] = o[key];
    return acc;
  }, {});

  return (
    <div className="block">
      {authorization_url && (
        <div className="fieldset">
          <InfoLabel label="Authorization Request - Browser redirect" toolTip={authorizationRequestT()}
                     copyToClipBoardText={authorization_url}/>
          <input disabled value={authorization_url}/>
        </div>
      )}
      {authorization_url && (
        <div className="fieldset">
          <label>Query parameters</label>
          <JSONPretty data={sortObject(queryParameters)}/>
        </div>
      )}
      {(authorization_url && queryParameters.request) && (
        <div className="fieldset">
          <DecodeToken token={queryParameters.request}
                       name="JWT request parameter" toolTip={signedJWTRequestParameterT()}/>
        </div>
      )}
      {request_url && (
        <div className="fieldset">
          <InfoLabel label={requestLabel} toolTip={toolTip} copyToClipBoardText={request_url}/>
          <input disabled value={request_url}/>
        </div>
      )}
      {request_headers && (
        <div className="fieldset">
          <label>Headers</label>
          <JSONPretty data={sortObject(request_headers)}/>
        </div>
      )}
      {request_body && (
        <div className="fieldset">
          <label>Form parameters</label>
          <JSONPretty data={sortObject(request_body)}/>
        </div>
      )}
      {(request_body && request_body.client_assertion) && (
        <div className="fieldset">
          <DecodeToken token={request_body.client_assertion}
                       name="JWT client assertion" toolTip={clientAssertionToolTip(state)}/>
        </div>
      )}

      {result && (
        <div className="fieldset">
          <label>{`Result ${tookTime}`}</label>
          <JSONPretty data={
            ((request_url && request_url.endsWith("openid-configuration")) || store.apiCall) ? result : sortObject(result)
          }/>
        </div>
      )}
    </div>
  );
});
