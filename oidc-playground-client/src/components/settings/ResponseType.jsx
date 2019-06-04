import React from "react";
import {ReactSelect} from "components";
import {responseTypesT} from "./Tooltips";
import {InfoLabel} from "../InfoLabel";

function sanitizeOptions(options, {auth_protocol, grant_type}) {
  if (auth_protocol === "OpenID") {
    switch (grant_type) {
      case "authorization_code":
        return ["code"];
      case "implicit":
        return options.filter(opt => !["code", "token"].includes(opt));
      case "client_credentials":
        return ["token", "id_token"];
      default:
        return options;
    }
  }

  switch (grant_type) {
    case "authorization_code":
      return ["code"];
    case "implicit":
    case "client_credentials":
      return ["token"];
    default:
      return options;
  }
}

export function ResponseType(props) {
  return (
    <fieldset>
      <InfoLabel label="Response type" toolTip={responseTypesT()}/>
      <ReactSelect
        {...props}
        options={sanitizeOptions(props.options, props.moderators)}
        className="select-response-type"
      />
    </fieldset>
  );
}
