import React from "react";
import { InfoLabel, ReactSelect } from "components";
import { tokenEndpointAuthenticationT } from "components/settings/Tooltips";

export function TokenEndpointAuthMethod({ moderators, ...rest }) {
  if (moderators.grant_type === "implicit" || moderators.frontChannelTokenRequest) {
    return null;
  }

  return (
    <fieldset>
      <InfoLabel label="Token endpoint authentication" toolTip={tokenEndpointAuthenticationT()} />
      <ReactSelect {...rest} />
    </fieldset>
  );
}
