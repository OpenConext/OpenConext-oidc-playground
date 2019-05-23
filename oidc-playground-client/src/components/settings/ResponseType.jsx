import React from "react";
import { ReactSelect } from "components";

function sanitizeOptions(options, { auth_protocol, grant_type }) {
  if (auth_protocol === "OpenID") {
    switch (grant_type) {
      case "authorization_code":
        return ["token"];
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
      <label>Response type</label>
      <ReactSelect
        {...props}
        options={sanitizeOptions(props.options, props.moderators)}
        className="select-response-type"
      />
    </fieldset>
  );
}
