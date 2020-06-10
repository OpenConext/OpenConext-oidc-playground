import React from "react";
import { CheckBox } from "components";
import { forceConsentT } from "components/settings/Tooltips";

export const ForceConsent = props => {
  if (props.moderators.grant_type === "client_credentials") {
    return null;
  }

  return (
    <fieldset>
      <CheckBox {...props} name="forceConsent" label="Force consent" toolTip={forceConsentT()} />
    </fieldset>
  );
};
