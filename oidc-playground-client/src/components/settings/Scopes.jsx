import React from "react";
import { ReactSelect } from "components";

export function Scopes(props) {
  var fixedValues = [];

  if (props.moderators.authProtocol === "OpenID") {
    fixedValues = ["openid"];

    if (!props.value.includes("openid")) {
      props.value.unshift("openid");
    }
  }

  return (
    <fieldset>
      <label>Scopes</label>
      <ReactSelect {...props} fixedValues={fixedValues} isMulti freeFormat />
    </fieldset>
  );
}
