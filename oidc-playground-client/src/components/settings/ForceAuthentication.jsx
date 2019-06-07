import React from "react";
import { CheckBox } from "components";
import { forceAuthenticationT } from "components/settings/Tooltips";

export const ForceAuthentication = props => {
  if (props.moderators.grant_type === "client_credentials") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox {...props} name="forceAuthentication" label="Force authentication" toolTip={forceAuthenticationT()} />
    </fieldset>
  );
};
