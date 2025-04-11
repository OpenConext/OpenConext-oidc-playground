import React from "react";
import { InfoLabel, ReactSelect } from "components";
import { requestedClaimsT } from "components/settings/Tooltips";

export function Claims(props) {
  const excludedClaims = [
    "aud",
    "nbf",
    "iss",
    "exp",
    "iat",
    "jti",
    "nonce",
    "at_hash",
    "c_hash",
    "s_hash",
    "at_hash"
  ];
  const options = props.options.filter(claim => !excludedClaims.includes(claim));

  if (props.moderators.auth_protocol === "Oauth2") {
    return null;
  }

  return (
    <fieldset>
      <InfoLabel label="Requested claims" toolTip={requestedClaimsT()} />
      <ReactSelect {...props} options={options} isMulti claims />
    </fieldset>
  );
}
