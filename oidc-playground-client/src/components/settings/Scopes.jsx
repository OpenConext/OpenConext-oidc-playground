import React from "react";
import {ReactSelect} from "components";

const isOpenIdUsed = props => props.moderators.auth_protocol === "OpenID";

const sanitizeOptions = (isOpenId, options) => isOpenId ? options : options.filter(opt => opt !== "openid");

export function Scopes(props) {
  let fixedValues = [];

  if (isOpenIdUsed(props)) {
    fixedValues = ["openid"];
    if (!props.value.includes("openid")) {
      props.value.unshift("openid");
    }
  } else {
    props.value.shift();
  }

  return (
    <fieldset>
      <label>Scopes</label>
      <ReactSelect
        {...props}
        options={sanitizeOptions(isOpenIdUsed(props), props.options)}
        className="select-scopes"
        fixedValues={fixedValues}
        isMulti
        freeFormat
      />
    </fieldset>
  );
}
