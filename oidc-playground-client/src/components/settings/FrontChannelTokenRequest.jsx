import React from "react";
import { CheckBox } from "components";
import { frontChannelTokenRequestT } from "components/settings/Tooltips";

export const FrontChannelTokenRequest = props => {
  if (props.moderators.grant_type === "client_credentials") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox {...props} name="frontChannelTokenRequest" label="Front channel token request" toolTip={frontChannelTokenRequestT()} />
    </fieldset>
  );
};
