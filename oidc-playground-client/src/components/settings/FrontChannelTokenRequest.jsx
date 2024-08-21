import React from "react";
import {CheckBox} from "components";
import {frontChannelTokenRequestT} from "components/settings/Tooltips";

export const FrontChannelTokenRequest = props => {
  const grantType = props.moderators.grant_type;
  if (grantType === "client_credentials" || grantType === "implicit") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox {...props} name="frontChannelTokenRequest" label="Front channel token request" toolTip={frontChannelTokenRequestT()} />
    </fieldset>
  );
};
