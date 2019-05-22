import React from "react";
import { ReactSelect } from "components";

export function ResponseType(props) {
  function sanitizeOptions(options, { authProtocol, grantType }) {
    if (authProtocol === "OpenID") {
      switch (grantType) {
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

    switch (grantType) {
      case "authorization_code":
        return ["code"];
      case "implicit":
      case "client_credentials":
        return ["token"];
      default:
        return options;
    }
  }

  return (
    <fieldset>
      <label>Response type</label>
      <ReactSelect
        {...props}
        options={sanitizeOptions(props.options, props.moderators)}
      />
    </fieldset>
  );
}
