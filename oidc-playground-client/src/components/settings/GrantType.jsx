import React from "react";
import {InfoLabel, ReactSelect} from "components";
import {grantTypes} from "./Tooltips";

const isOpenIdUsed = props => props.moderators.auth_protocol === "OpenID";

const sanitizeOptions = (isOpenId, options) =>
  options.filter(opt => opt !== "refresh_token")
    .filter(opt => !isOpenId || opt !== "client_credentials");

export function GrantType(props) {
  return (
    <fieldset>
      <InfoLabel label="Grant type" toolTip={grantTypes()}/>
      <ReactSelect
        {...props}
        className="select-grant-type"
        options={sanitizeOptions(isOpenIdUsed(props), props.options)}
      />
    </fieldset>
  );
}
